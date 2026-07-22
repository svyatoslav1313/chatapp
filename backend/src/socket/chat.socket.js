import { WebSocketServer } from "ws";
import url from "url";
import { jwtService } from "../services/jwt.service.js";
import { messageService } from "../services/message.service.js";

// Хранилище активных комнат: chatId -> Set<WebSocket>
const rooms = new Map();

export const initWebSocket = (wss) => {
  wss.on("connection", async (ws, req) => {
    // 1. Авторизация: достаем token из query-параметров URL (ws://... ?token=ABC)
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const token = parsedUrl.searchParams.get("token");

    if (!token) {
      ws.close(4001, "Unauthorized: No token provided");
      return;
    }

    try {
      const userData = jwtService.verifyAccessToken(token);
      ws.user = userData; // Привязываем юзера к сокету
      ws.currentChatId = null;
      console.log(`⚡ User connected: ${ws.user.nickname}`);
    } catch (error) {
      ws.close(4003, "Unauthorized: Invalid token");
      return;
    }

    // 2. Обработка входящих сообщений
    ws.on("message", async (rawMessage) => {
      try {
        const payload = JSON.parse(rawMessage.toString());
        const { event, data } = payload;

        switch (event) {
          // Пользователь открыл чат
          case "join_chat": {
            const { chatId } = data;

            // Если уже сидел в другом чате — выходим из него и подчищаем
            if (ws.currentChatId && rooms.has(ws.currentChatId)) {
              const oldRoom = rooms.get(ws.currentChatId);
              oldRoom.delete(ws);

              if (oldRoom.size === 0) {
                rooms.delete(ws.currentChatId);
              }
            }

            ws.currentChatId = chatId;

            if (!rooms.has(chatId)) {
              rooms.set(chatId, new Set());
            }
            rooms.get(chatId).add(ws);
            break;
          }

          // Пользователь отправил сообщение
          case "send_message": {
            const { chatId, text } = data;
            if (!text || !text.trim()) return;

            // Сохраняем в PostgreSQL
            const newMessage = await messageService.sendMessage(
              chatId,
              ws.user.id,
              text,
            );

            // Рассылаем всем подключенным к этой комнате
            const chatRoom = rooms.get(chatId);
            if (chatRoom) {
              const broadcastData = JSON.stringify({
                event: "new_message",
                data: newMessage,
              });

              chatRoom.forEach((client) => {
                if (client.readyState === client.OPEN) {
                  client.send(broadcastData);
                }
              });
            }
            break;
          }
        }
      } catch (err) {
        console.error("Error processing ws message:", err);
      }
    });

    // 3. Отключение пользователя
    ws.on("close", () => {
      if (ws.currentChatId && rooms.has(ws.currentChatId)) {
        rooms.get(ws.currentChatId).delete(ws);
        if (rooms.get(ws.currentChatId).size === 0) {
          rooms.delete(ws.currentChatId);
        }
      }
      console.log(`❌ User disconnected: ${ws.user?.nickname}`);
    });
  });
};
