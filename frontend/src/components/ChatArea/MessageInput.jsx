import { Send } from "lucide-react";
import styles from "./MessageInput.module.scss";
import { useSocket } from "../../Context/useSocket";
import { useState } from "react";
import { useRef } from "react";
import { useLayoutEffect } from "react";

export const MessageInput = ({ chatId }) => {
  const { sendMessage, userStartTyping, userStopTyping } = useSocket();
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(null);
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  // Поле растёт вместе с текстом; верхний предел задан через max-height в стилях
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    const borders = textarea.offsetHeight - textarea.clientHeight;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + borders}px`;
  }, [text]);

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

  const handleKeyDown = (e) => {
    // На тач-устройствах Enter переносит строку, отправка — кнопкой
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing &&
      !isTouch
    ) {
      handleSubmit(e);
    }
  };

  return (
    <form className={styles.inputBar} onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="Type a message..."
        aria-label="Message"
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={styles.messageInput}
      />
      <button
        type="submit"
        className={styles.sendButton}
        aria-label="Send message"
        disabled={!text.trim()}
      >
        <Send size={16} />
      </button>
    </form>
  );
};
