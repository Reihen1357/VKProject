import { Friend, Post, User } from "../tableModels/models.js";
import { ApiError } from "../error/ApiError.js";
import * as uuid from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PostController {
  async create(request, response, next) {
    try {
      let { title, content } = request.body;
      const { image } = request.files ?? {};
      let fileName = image ? uuid.v4() + path.extname(image.name) : null;
      if (fileName !== null) {
        await image.mv(path.join(__dirname, "..", "static", fileName));
      }
      const post = await Post.create({
        title,
        content,
        likes: 0,
        creationDate: new Date().toUTCString(),
        image: fileName,
        userId: request.user.id,
      });
      return response.json(post);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(request, response) {
    let userId = request.user.id;
    const friends = await Friend.findAll({
      where: { userId },
    });
    const friendsIds = friends.map((item) => item.friendId);

    const posts = await Post.findAll({
      where: { userId: friendsIds },
      order: [["creationDate", "DESC"]],
      include: {
        model: User,
        required: true,
        attributes: {
          exclude: ["email", "password"],
        },
      },
    });
    return response.json(posts);
  }

  async getByUserId(request, response, next) {
    try {
      const { userId } = request.query;
      const posts = await Post.findAll({
        where: { userId },
        include: {
          model: User,
          required: true,
          attributes: {
            exclude: ["email", "password"],
          },
        },
      });
      return response.json(posts);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async likePost(request, response, next) {
    try {
      const { postId } = request.query;
      const result = await Post.increment("likes", {
        by: 1,
        where: {
          id: postId,
        },
      });
      return response.json(result);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}
