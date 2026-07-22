/* eslint-disable no-console */
"use strict";

import "dotenv/config";
import express from "express";
import cors from "cors";
import { WebSocket, WebSocketServer } from "ws";
import { initWebSocket } from "./socket/chat.socket.js";
import cookieParser from "cookie-parser";
import { authRouter } from "./routers/auth.route.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { chatRouter } from "./routers/chat.route.js";
import { messageRouter } from "./routers/message.route.js";

// 1. Импортируем подключение и модели
import { client } from "./src/utils/db.js";
import "./src/models/index.js";

const PORT = process.env.PORT || 3005;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_HOST,
    credentials: true,
  }),
);

app.use(authRouter);
app.use("/chats", chatRouter);
app.use("/message", messageRouter);

app.use(errorMiddleware);

// 2. Оборачиваем запуск в async-функцию
async function startServer() {
  try {
    // Подключаемся к Neon и создаём/обновляем таблицы (БЕЗ удаления данных)
    await client.sync({ alter: true });
    console.log("Database synchronized successfully!");

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    const wss = new WebSocketServer({ server });
    initWebSocket(wss);
  } catch (error) {
    console.error("Failed to start server or sync DB:", error);
  }
}

startServer();
