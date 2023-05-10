import {Router} from "express";
import {FriendController} from "../controllers/friendController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router()
const friendController = new FriendController()

router.post('/add',authMiddleware, friendController.add)
router.get('/getAll',authMiddleware, friendController.getAll)
router.get('/getOne',authMiddleware, friendController.getOne)
router.delete('/delete', authMiddleware, friendController.deleteFriend)

export default router