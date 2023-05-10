import {Router} from "express";
import {PostController} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router()
const postController = new PostController()

router.get('/getAll', authMiddleware, postController.getAll)
router.post('/create',authMiddleware, postController.create)
router.get('/getByUserId',authMiddleware, postController.getByUserId)
router.patch('/like', authMiddleware, postController.likePost)

export default router