import { httpClient } from "../http/httpClient.js";

function getMessages(chatId) {
  return httpClient.get(`/message/${chatId}`);
}

export const messageService = {
  getMessages,
};
