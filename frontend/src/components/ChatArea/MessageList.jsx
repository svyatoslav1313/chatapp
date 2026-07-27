import { useEffect, useRef, useState } from "react";
import { messageService } from "../../services/messageService.js";
import styles from "./MessageList.module.scss";
import { formatMessageTime } from "../../utils/chat.adapter.js";
import { useSocket } from "../../Context/useSocket";

export const MessageList = ({ userId, chatId }) => {
  const { onMessage } = useSocket();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);

  const scrollToBottom = (behavior = "auto") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    messageService
      .getMessages(chatId)
      .then((res) => setMessages(res))
      .finally(() => {
        requestAnimationFrame(() => scrollToBottom());
      });
  }, [chatId]);

  useEffect(() => {
    const unsubscribe = onMessage((incomingMessage) => {
      if (incomingMessage && incomingMessage.chatId === chatId) {
        setMessages((prev) => [...prev, incomingMessage]);

        requestAnimationFrame(() => scrollToBottom("smooth"));
      }
    });

    return unsubscribe;
  }, [chatId, onMessage]);

  return (
    <div className={styles.messagesContainer}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.message} ${message.senderId === userId ? styles.outgoing : styles.incoming}`}
        >
          <div className={styles.msgContent}>
            {message.text}
            <span className={styles.msgTime}>
              {formatMessageTime(message.createdAt)}
            </span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
