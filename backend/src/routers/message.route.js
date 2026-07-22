import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { messageController } from "../controllers/message.controller.js";
import { catchError } from "../utils/catchError.js";

export const messageRouter = new express.Router();
// Получить историю сообщений конкретного чата по його chatId
messageRouter.get(
  "/:chatId",
  authMiddleware,
  catchError(messageController.getByChatId),
);

// Отправить сообщение в чат через HTTP REST API (запасной вариант без сокетов)
messageRouter.post(
  "/:chatId",
  authMiddleware,
  catchError(messageController.sendMessage),
);
