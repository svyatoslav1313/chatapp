import { httpClient } from "../http/httpClient";

function getChats() {
  return httpClient.get("/chats");
}

function searchUsers(query) {
  return httpClient.get("/chats/search", {
    params: { query },
  });
}

function createDirectChat(targetUserId) {
  return httpClient.post("/chats/direct", {
    targetUserId,
  });
}

export const chatService = {
  getChats,
  searchUsers,
  createDirectChat,
};
