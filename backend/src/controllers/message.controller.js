import { messageService } from "../services/message.service.js";

const getByChatId = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const userId = req.user.id;

    const messages = await messageService.getByChatId(chatId, userId);

    res.send(messages);
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res) => {
  const { chatId } = req.params;

  const { text } = req.body;

  const message = await messageService.sendMessage(chatId, req.user.id, text);

  res.status(201).send(message);
};

export const messageController = {
  getByChatId,
  sendMessage,
};
