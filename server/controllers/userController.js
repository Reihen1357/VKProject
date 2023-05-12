import { ApiError } from "../error/ApiError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Friend, User } from "../tableModels/models.js";
import { Op } from "sequelize";
import * as uuid from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateJWT = (id, email) => {
  return jwt.sign({ id, email }, `${process.env.SECRET_KEY}`, {
    expiresIn: "12h",
  });
};

export class UserController {
  async registration(request, response, next) {
    const { email, password, name, surname, age, city, university } =
      request.body;
    const { image } = request.files;
    let fileName = uuid.v4() + path.extname(image.name);
    await image.mv(path.join(__dirname, "..", "static", fileName));
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректный email/password"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(
        ApiError.badRequest("Пользователь с таким email уже существует")
      );
    }
    const hashPassword = await bcrypt.hash(password, 8);
    const user = await User.create({
      email,
      password: hashPassword,
      name,
      surname,
      image: fileName,
      age,
      city,
      university,
    });
    const token = generateJWT(user.id, user.email);
    return response.json({ token });
  }

  async login(request, response, next) {
    const { email, password } = request.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return next(ApiError.internal("Пользователь не найден"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Неверно указан пароль"));
    }
    const token = generateJWT(user.id, user.email);
    return response.json({ token });
  }

  async check(request, response) {
    const token = generateJWT(request.user.id, request.user.email);
    return response.json({ token });
  }

  async info(request, response, next) {
    try {
      const { userId } = request.query;
      const { id: currentUserId } = request.user;
      const user = await User.findOne({
        where: { id: userId },
        attributes: {
          exclude: "password",
        },
      });
      user.setDataValue("isPersonalPage", userId == currentUserId);
      return response.json(user);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async findUsers(request, response, next) {
    try {
      const { name, surname } = request.query;
      const { id } = request.user;
      if (!name && !surname) {
        return response.json(
          await User.findAll({
            where: {
              id: {
                [Op.notIn]: [id],
              },
            },
          })
        );
      }
      const condition = {};
      if (name) {
        condition.name = {
          [Op.iLike]: `%${name}%`,
        };
      }
      if (surname) {
        condition.surname = {
          [Op.iLike]: `%${surname}%`,
        };
      }
      const friends = await Friend.findAll({
        where: {
          userId: id,
        },
      });
      const foundUsers = await User.findAll({
        where: {
          id: {
            [Op.notIn]: [id],
          },
          [Op.or]: condition,
        },
        attributes: {
          exclude: ["email", "password"],
        },
      });
      foundUsers.forEach((user) => {
        user.setDataValue(
          "isFriend",
          friends.some((f) => f.friendId == user.id)
        );
      });
      return response.json(foundUsers);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
  async getUserAvatar(request, response, next) {
    try {
      const user = await User.findOne({
        attributes: ["image"],
        where: {
          id: request.query.id,
        },
      });
      return response.json(user.image);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
}
