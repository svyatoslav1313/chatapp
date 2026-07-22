import { Send } from "lucide-react";
import styles from "./MessageInput.module.scss";
import { useSocket } from "../../Context/SocketContext";
import { useState } from "react";

export const MessageInput = ({ chatId }) => {
  const [text, setText] = useState("");
  const { sendMessage } = useSocket();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || !chatId) return;

    sendMessage(chatId, text);
    setText("");
  };

  return (
    <form className={styles.inputBar} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={styles.messageInput}
      />
      <button type="submit" className={styles.sendButton}>
        <Send size={16} />
      </button>
    </form>
  );
};
