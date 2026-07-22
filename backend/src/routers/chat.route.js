import express from "express";
import { catchError } from "../utils/catchError.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { chatController } from "../controllers/chat.controller.js";

export const chatRouter = new express.Router();

chatRouter.get("/", authMiddleware, catchError(chatController.getUserChats));
chatRouter.get(
  "/search",
  authMiddleware,
  catchError(chatController.searchUsers),
);
chatRouter.post(
  "/direct",
  authMiddleware,
  catchError(chatController.createDirectChat),
);
chatRouter.post("/room", authMiddleware, catchError(chatController.createRoom));
