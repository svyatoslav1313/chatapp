import { Op } from "sequelize";
import { Chat, User, Message, UserChat } from "../models/index.js";

const getUserDirectChats = async (userId) => {
  const userChats = await UserChat.findAll({
    where: { userId },
    attributes: ["chatId"],
    raw: true,
  });

  const chatIds = userChats.map((item) => item.chatId);

  if (!chatIds.length) return [];

  return await Chat.findAll({
    where: {
      id: chatIds,
      type: "direct",
    },
    include: [
      {
        model: User,
        attributes: ["id", "nickname", "email"],
        through: { attributes: [] },
      },
      {
        model: Message,
        separate: true,
        limit: 1,
        order: [["createdAt", "DESC"]],
        include: [
          { model: User, as: "sender", attributes: ["id", "nickname"] },
        ],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });
};

const searchUsers = async (query, currentUserId) => {
  const users = await User.findAll({
    where: {
      id: { [Op.ne]: currentUserId }, // Исключаем самого себя
      nickname: { [Op.iLike]: `%${query.trim()}%` },
    },
    attributes: ["id", "nickname", "email"],
    limit: 10,
    raw: true, // Получаем чистые JS-объекты
  });

  if (!users.length) return [];

  const foundUserIds = users.map((u) => u.id);

  // 2. Достаем все chatId текущего пользователя
  const myUserChats = await UserChat.findAll({
    where: { userId: currentUserId },
    attributes: ["chatId"],
    raw: true,
  });
  const myChatIds = myUserChats.map((uc) => uc.chatId);

  // 3. Ищем, есть ли среди найденных пользователей те, кто уже состоит в наших чатах
  const existingUserChats = await UserChat.findAll({
    where: {
      chatId: myChatIds,
      userId: foundUserIds,
    },
    attributes: ["userId", "chatId"],
    raw: true,
  });

  // Создаем словарь (Map) для мгновенного поиска: userId -> chatId
  const userChatMap = new Map(
    existingUserChats.map((item) => [item.userId, item.chatId]),
  );

  // 4. Примешиваем chatId к каждому найденному пользователю
  return users.map((user) => ({
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    chatId: userChatMap.get(user.id) || null, // Если чата нет — подставит null
  }));
};

const createDirectChat = async (currentUserId, targetUserId) => {
  const userChats = await UserChat.findAll({
    where: { userId: currentUserId },
    attributes: ["chatId"],
    raw: true,
  });

  const chatIds = userChats.map((usChat) => usChat.chatId);

  let chat = await Chat.findOne({
    where: { id: chatIds, type: "direct" },
    include: [{ model: User, where: { id: targetUserId } }],
  });

  if (!chat) {
    chat = await Chat.create({ type: "direct" });

    await UserChat.bulkCreate([
      { userId: currentUserId, chatId: chat.id },
      { userId: targetUserId, chatId: chat.id },
    ]);
  }

  return await Chat.findByPk(chat.id, {
    include: [
      {
        model: User,
        attributes: ["id", "nickname", "email"],
        through: { attributes: [] },
      },
      {
        model: Message,
        separate: true,
        limit: 1,
        order: [["createdAt", "DESC"]],
      },
    ],
  });
};

const createRoom = async (name, currentUserId) => {
  const newRoom = await Chat.create({ type: "room", name });
  await UserChat.create({ userId: currentUserId, chatId: newRoom.id });

  return newRoom;
};

export const chatService = {
  getUserDirectChats,
  searchUsers,
  createDirectChat,
};
