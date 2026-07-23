import { Hash, Plus } from "lucide-react";
import styles from "./ChatList.module.scss";

export const ChatList = ({
  activeTab,
  chats,
  rooms,
  selectedChatId,
  onSelect,
}) => {
  return (
    <div className={styles.listContainer}>
      {activeTab === "direct" ? (
        chats.length > 0 ? (
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
                  <span className={styles.lastMsg}>
                    {chat.senderPrefix && <b>{chat.senderPrefix}</b>}
                    {chat.lastMessageText}
                  </span>
                  {chat.type === "direct" && chat.presenceLabel && (
                    <span className={styles.chatTime}>
                      {chat.presenceLabel}
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
          <div className={styles.emptyHint}>
            У вас пока нет личных сообщений
          </div>
        )
      ) : (
        <>
          {/* Логику комнат пока не трогаем */}
          <button className={styles.createRoomBtn}>
            <Plus size={16} />
            <span>Create New Room</span>
          </button>
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`${styles.chatItem} ${
                selectedChatId === room.id ? styles.selected : ""
              }`}
              onClick={() => onSelect(room)}
            >
              <div className={styles.roomIcon}>
                <Hash size={18} />
              </div>
              <div className={styles.chatInfo}>
                <div className={styles.chatHeader}>
                  <span className={styles.chatTitle}>{room.name}</span>
                  <span className={styles.membersCount}>
                    {room.members} members
                  </span>
                </div>
                <span className={styles.lastMsg}>{room.desc}</span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
