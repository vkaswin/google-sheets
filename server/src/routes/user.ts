import { Router } from "express";
import UserController from "../controllers/user";

const router = Router();

router.post("/sign-in", UserController.signIn);
router.post("/sign-up", UserController.signUp);

export default router;
