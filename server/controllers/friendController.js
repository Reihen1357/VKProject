import {Friend, User} from "../tableModels/models.js";
import {ApiError} from "../error/ApiError.js";
import {Op} from "sequelize";

export class FriendController {
    async add(request, response, next) {
        try {
            let {friendId} = request.body
            const friend = await Friend.create({friendId, userId: request.user.id})
            return response.json(friend)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(request, response, next) {
        try {
            const userId = request.user.id
            if (!userId) {
                throw Error('User is not logged')
            }
            const friends = await Friend.findAll({where: {userId}})
            const friendsIds = friends.map(item => item.friendId)
            const friendsData = await User.findAll({where: {id: friendsIds}})
            return response.json(friendsData)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(request, response, next) {
        try {
            const userId = request.user.id
            const friend = await Friend.findOne({where: {userId}})
            return response.json(friend)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async deleteFriend(request, response, next) {
        try {
            const userId = request.user.id
            const friendId = request.query.friendId
            const friend = await Friend.destroy({
                where:
                    {
                        [Op.and]:
                            {userId, friendId}
                    }
            })
            return response.json(friend)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}