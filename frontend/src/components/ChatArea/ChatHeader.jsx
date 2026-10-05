import { MoreVertical, ArrowLeft } from "lucide-react";
import styles from "./ChatHeader.module.scss";

export const ChatHeader = ({ selectedChat, onOpenSidebar }) => {
  return (
    <div className={styles.chatHeaderBar}>
      <div className={styles.headerLeft}>
        {/* Кнопка возврата к списку чатов на мобильных */}
        <button
          className={styles.menuButton}
          onClick={onOpenSidebar}
          title="Back to chats"
          aria-label="Back to chats"
        >
          <ArrowLeft size={20} />
        </button>

        <div className={styles.avatar}>
          {selectedChat.avatarLetter ||
            selectedChat.title?.[0]?.toUpperCase() ||
            "?"}
          {selectedChat.online && <span className={styles.onlineBadge} />}
        </div>

        <div className={styles.activeChatDetails}>
          <h2 className={styles.activeChatTitle}>{selectedChat.title}</h2>
          {selectedChat.partnerIsTyping ? (
            <span className={`${styles.activeChatSub} ${styles.typing}`}>
              Typing...
            </span>
          ) : (
            <span className={styles.activeChatSub}>
              {selectedChat.presenceLabel}
            </span>
          )}
        </div>
      </div>

      <button className={styles.iconButton} aria-label="More">
        <MoreVertical size={18} />
      </button>
    </div>
  );
};
