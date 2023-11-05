import { Router } from "express";
import { getAllUsers, logIn, signUp } from "../controllers/user.controller.js";
import {
  logInValidator,
  signUpValidator,
  validate,
} from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";

const userRouter = Router();

userRouter
  .get("/", getAllUsers)
  .post("/signup", validate(signUpValidator), signUp)
  .post("/login", validate(logInValidator), logIn)
  .get("/auth-status", verifyToken, logIn);

export default userRouter;
