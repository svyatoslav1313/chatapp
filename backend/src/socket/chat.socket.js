import { WebSocketServer } from "ws";
import url from "url";
import { jwtService } from "../services/jwt.service.js";
import { messageService } from "../services/message.service.js";
import { UserChat } from "../models/UserChat.js";
import { User } from "../models/User.js";
import { chatService } from "../services/chat.service.js";

// Хранилище активных комнат: chatId -> Set<WebSocket>
const rooms = new Map();

const userSockets = new Map();

const broadcastStatusChange = async (
  userId,
  isOnline,
  lastSeen = new Date(),
) => {
  try {
    const partnerIds = await chatService.getDirectPartnersIds(userId);

    if (!partnerIds.length) return;

    const payload = {
      event: "user_status_changed",
      data: { userId, isOnline, lastSeen },
    };

    partnerIds.forEach((partnerId) => {
      broadCastToUser(partnerId, payload);
    });
  } catch (error) {
    console.error(error);
  }
};

const addUserSocket = async (userId, ws) => {
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }

  userSockets.get(userId).add(ws);

  if (userSockets.get(userId).size === 1) {
    await User.update({ isOnline: true }, { where: { id: userId } });
    broadcastStatusChange(userId, true);
  }
};

const removeUserSocket = async (userId, ws) => {
  if (!userSockets.has(userId)) {
    return;
  }

  const sockets = userSockets.get(userId);
  sockets.delete(ws);

  if (sockets.size === 0) {
    userSockets.delete(userId);

    const now = new Date();
    await User.update(
      { isOnline: false, lastSeen: now },
      { where: { id: userId } },
    );

    broadcastStatusChange(userId, false, now);
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
  // 1. Heartbeat: каждые 30 секунд проверяем зависшие сокеты
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        console.log(
          `💀 Terminating dead connection for user: ${ws.user?.nickname || "unknown"}`,
        );
        return ws.terminate(); // Вызывает событие "close"
      }

      ws.isAlive = false;
      ws.ping(); // Браузер автоматически ответит кадром pong
    });
  }, 30000);

  // Очищаем интервал при закрытии самого WebSocket сервера
  wss.on("close", () => {
    clearInterval(interval);
  });

  wss.on("connection", async (ws, req) => {
    // Инициализируем флаг активности сокета
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });

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

      await addUserSocket(userData.id, ws);

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
            break;
          }
        }
      } catch (err) {
        console.error("Error processing ws message:", err);
      }
    });

    // 3. Отключение пользователя
    ws.on("close", async () => {
      if (ws.user?.id) {
        await removeUserSocket(ws.user.id, ws);
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
