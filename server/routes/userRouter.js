import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router();
const userController = new UserController();

router.get("/auth", authMiddleware, userController.check);
router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/info", authMiddleware, userController.info);
router.get("/find", authMiddleware, userController.findUsers);
router.get("/getUserAvatar", authMiddleware, userController.getUserAvatar);

export default router;
