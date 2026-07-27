import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { catchError } from "../utils/catchError.js";
import { userController } from "../controllers/user.controller.js";

export const userRouter = new express.Router();

userRouter.patch(
  "/update-name",
  authMiddleware,
  catchError(userController.changeName),
);
userRouter.patch(
  "/update-nickname",
  authMiddleware,
  catchError(userController.changeNickname),
);
userRouter.patch(
  "/update-email",
  authMiddleware,
  catchError(userController.changeEmail),
);
userRouter.patch(
  "/update-password",
  authMiddleware,
  catchError(userController.changePassword),
);
