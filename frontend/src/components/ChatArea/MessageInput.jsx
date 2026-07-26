import { Send } from "lucide-react";
import styles from "./MessageInput.module.scss";
import { useSocket } from "../../Context/useSocket";
import { useState } from "react";
import { useRef } from "react";

export const MessageInput = ({ chatId }) => {
  const { sendMessage, userStartTyping, userStopTyping } = useSocket();
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(null);
  const [text, setText] = useState("");

  const handleInputChange = (e) => {
    setText(e.target.value);

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      userStartTyping(chatId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2500);
  };

  const stopTyping = () => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      userStopTyping(chatId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || !chatId) return;

    sendMessage(chatId, text);
    setText("");
    stopTyping();
  };

  return (
    <form className={styles.inputBar} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={handleInputChange}
        className={styles.messageInput}
      />
      <button type="submit" className={styles.sendButton}>
        <Send size={16} />
      </button>
    </form>
  );
};
