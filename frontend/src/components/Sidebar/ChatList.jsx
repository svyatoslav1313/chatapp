import styles from "./ChatList.module.scss";

export const ChatList = ({ chats, selectedChatId, onSelect }) => {
  return (
    <div className={styles.listContainer}>
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div
            key={chat.id}
            className={`${styles.chatItem} ${
              selectedChatId === chat.id ? styles.selected : ""
            }`}
            onClick={() => onSelect(chat.id)}
          >
            {/* Аватарка с первой буквой имени */}
            <div className={styles.avatar}>
              {chat.avatarLetter || chat.title?.[0]?.toUpperCase() || "?"}
              {chat.online && <span className={styles.onlineBadge} />}
            </div>

            {/* Информация о чате */}
            <div className={styles.chatInfo}>
              <div className={styles.chatHeader}>
                <span className={styles.chatTitle}>{chat.title}</span>
                <span className={styles.chatTime}>{chat.time}</span>
              </div>

              <div className={styles.chatSub}>
                {chat.partnerIsTyping ? (
                  <span className={styles.lastMsg}>Typing...</span>
                ) : (
                  <span className={styles.lastMsg}>
                    {chat.senderPrefix && <b>{chat.senderPrefix}</b>}
                    {chat.lastMessageText}
                  </span>
                )}

                {(chat.unreadCount > 0 || chat.unread > 0) && (
                  <span className={styles.unreadBadge}>
                    {chat.unreadCount || chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.emptyHint}>У вас пока нет личных сообщений</div>
      )}
    </div>
  );
};
