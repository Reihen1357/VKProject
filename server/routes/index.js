import {Router} from "express";
import userRouter from "./userRouter.js";
import postRouter from "./postRouter.js";
import friendRouter from "./friendRouter.js";

const router = new Router()

router.use('/user', userRouter)
router.use('/posts', postRouter)
router.use('/friend', friendRouter)

export default router