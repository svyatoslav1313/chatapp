import { Chat, Message, User, UserChat } from "../models/index.js";
import { ApiError } from "../exceptions/api.error.js";

const getByChatId = async (chatId, userId) => {
  const chat = await Chat.findByPk(chatId);

  if (!chat) {
    throw ApiError.badRequest("Чат не найден");
  }

  const isParticipant = await UserChat.findOne({
    where: { chatId, userId },
  });

  if (!isParticipant) {
    throw ApiError.badRequest("У вас нет доступа к этому чату");
  }

  return await Message.findAll({
    where: { chatId },
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "nickname", "email"],
      },
    ],
    order: [["createdAt", "ASC"]],
  });
};

const sendMessage = async (chatId, senderId, text) => {
  const message = await Message.create({ chatId, senderId, text });

  return await Message.findByPk(message.id, {
    include: [
      {
        model: Chat,
        attributes: ["id"],
      },
      {
        model: User,
        as: "sender",
        attributes: ["id", "nickname"],
      },
    ],
  });
};

const getMessageSenderId = async (messageId) => {
  const message = await Message.findByPk(messageId, {
    attributes: ["senderId"],
  });

  return message ? message.senderId : null;
};

const deleteMessage = async (messageId, chatId) => {
  await Message.destroy({ where: { id: messageId } });

  const lastMessage = await Message.findOne({
    where: { chatId },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "nickname"],
      },
    ],
  });

  return lastMessage;
};

export const messageService = {
  getByChatId,
  sendMessage,
  getMessageSenderId,
  deleteMessage,
};
