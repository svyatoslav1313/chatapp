import { MoreVertical } from "lucide-react";
import styles from "./ChatHeader.module.scss";

export const ChatHeader = ({ selectedChat }) => {
  return (
    <div className={styles.chatHeaderBar}>
      <div className={styles.activeChatDetails}>
        <h2 className={styles.activeChatTitle}>{selectedChat.title}</h2>
        {selectedChat.type === "room" && (
          <span className={styles.activeChatSub}>
            {selectedChat.nickname || `${selectedChat.members} members active`}
          </span>
        )}
      </div>
      <button className={styles.iconButton}>
        <MoreVertical size={18} />
      </button>
    </div>
  );
};
