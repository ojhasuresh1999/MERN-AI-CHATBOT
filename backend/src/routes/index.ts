import { Router } from "express";
import userRouter from "./user-router.js";
import chatRouter from "./chat-router.js";

const appRouter = Router();
//! Routes
appRouter.use("/user", userRouter);
appRouter.use("/chats", chatRouter);
export default appRouter;
