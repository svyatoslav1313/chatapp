import { useEffect, useState } from "react";
import { messageService } from "../../services/messageService.js";
import styles from "./MessageList.module.scss";
import { formatMessageTime } from "../../utils/chat.adapter.js";
import { useSocket } from "../../Context/SocketContext.jsx";

export const MessageList = ({ userId, chatId }) => {
  const [messages, setMessages] = useState([]);
  const { joinChat, incomingMessage } = useSocket();

  useEffect(() => {
    messageService.getMessages(chatId).then((res) => setMessages(res));

    joinChat(chatId);
  }, [chatId, joinChat]);

  useEffect(() => {
    if (incomingMessage && incomingMessage.chatId === chatId) {
      setMessages((prev) => [...prev, incomingMessage]);
    }
  }, [incomingMessage, chatId]);

  return (
    <div className={styles.messagesContainer}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.message} ${message.senderId === userId ? styles.outgoing : styles.incoming}`}
        >
          <div className={styles.msgContent}>{message.text}</div>
          <span className={styles.msgTime}>
            {formatMessageTime(message.createdAt)}
          </span>
        </div>
      ))}
    </div>
  );
};
