import { useEffect, useRef, useState } from "react";
import { messageService } from "../../services/messageService.js";
import styles from "./MessageList.module.scss";
import { formatMessageTime } from "../../utils/chat.adapter.js";
import { useSocket } from "../../Context/useSocket";
import { Trash } from "lucide-react";

export const MessageList = ({ userId, chatId }) => {
  const { onMessage, deleteMessage, onMessageDelete } = useSocket();
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

  useEffect(() => {
    const unsubscribe = onMessageDelete(({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageId),
      );
    });

    return unsubscribe;
  }, [onMessageDelete]);

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
            {message.senderId === userId && (
              <Trash
                size={14}
                className={styles.icon}
                onClick={() => deleteMessage(chatId, message.id)}
              />
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
