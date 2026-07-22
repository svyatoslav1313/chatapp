import { chatService } from "../services/chat.service.js";

const getUserChats = async (req, res) => {
  const chats = await chatService.getUserDirectChats(req.user.id);

  res.send(chats);
};

const searchUsers = async (req, res) => {
  const { query } = req.query;

  const users = await chatService.searchUsers(query, req.user.id);

  res.send(users);
};

const createDirectChat = async (req, res) => {
  const { targetUserId } = req.body;

  const chat = await chatService.createDirectChat(req.user.id, targetUserId);

  res.status(201).send(chat);
};

export const createRoom = async (req, res) => {
  const { name } = req.body;

  const room = await chatService.createRoom(name, req.user.id);

  res.status(201).send(room);
};

export const chatController = {
  getUserChats,
  searchUsers,
  createDirectChat,
};
