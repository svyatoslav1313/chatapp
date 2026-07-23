import { WebSocketServer } from "ws";
import url from "url";
import { jwtService } from "../services/jwt.service.js";
import { messageService } from "../services/message.service.js";
import { UserChat } from "../models/UserChat.js";

// Хранилище активных комнат: chatId -> Set<WebSocket>
const rooms = new Map();

const userSockets = new Map();

const addUserSocket = (userId, ws) => {
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }

  userSockets.get(userId).add(ws);
};

const removeUserSocket = (userId, ws) => {
  if (!userSockets.has(userId)) {
    return;
  }

  const sockets = userSockets.get(userId);
  sockets.delete(ws);

  if (sockets.size === 0) {
    userSockets.delete(userId);
  }
};

const broadCastToUser = (userId, payload) => {
  const sockets = userSockets.get(userId);

  if (!sockets) {
    return;
  }

  const data = JSON.stringify(payload);

  sockets.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
};

export const initWebSocket = (wss) => {
  wss.on("connection", async (ws, req) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const token = parsedUrl.searchParams.get("token");

    if (!token) {
      ws.close(4001, "Unauthorized: No token provided");
      return;
    }

    try {
      const userData = jwtService.verifyAccessToken(token);

      ws.user = userData;
      ws.currentChatId = null;

      addUserSocket(userData.id, ws);

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

          case "send_message": {
            const { chatId, chatType, text } = data;
            if (!text || !text.trim()) return;

            const newMessage = await messageService.sendMessage(
              chatId,
              ws.user.id,
              text,
            );

            const payload = {
              event: "new_message",
              data: newMessage,
            };

            if (chatType === "direct") {
              const participants = await UserChat.findAll({
                where: { chatId },
                attributes: ["userId"],
                raw: true,
              });

              participants.forEach(({ userId }) => {
                broadCastToUser(userId, payload);
              });
            } else {
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
            }
          }
        }
      } catch (err) {
        console.error("Error processing ws message:", err);
      }
    });

    // 3. Отключение пользователя
    ws.on("close", () => {
      if (ws.user?.id) {
        removeUserSocket(ws.user.id, ws);
      }

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
