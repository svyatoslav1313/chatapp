import { ApiError } from "../exceptions/api.error.js";
import { messageService } from "../services/message.service.js";

const getByChatId = async (req, res, next) => {
  const { chatId } = req.params;

  const userId = req.user.id;

  const messages = await messageService.getByChatId(chatId, userId);

  res.send(messages);
};

const sendMessage = async (req, res) => {
  const { chatId } = req.params;

  const { text } = req.body;

  const message = await messageService.sendMessage(chatId, req.user.id, text);

  res.status(201).send(message);
};

const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  const userId = req.user.id;

  const senderId = await messageService.getMessageSenderId(messageId);

  if (!senderId) {
    throw ApiError.badRequest("Message not found");
  }

  if (senderId !== userId) {
    throw ApiError.badRequest("You don't have access to delete this message");
  }

  await messageService.deleteMessage(messageId);

  res.send(messageId);
};

export const messageController = {
  getByChatId,
  sendMessage,
  deleteMessage,
};
