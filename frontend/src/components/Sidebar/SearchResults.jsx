// src/components/Sidebar/SearchResults.jsx
import { Loader } from "lucide-react";
import styles from "./ChatList.module.scss"; // Используем текущие стили карточек
import { formatPresenceLabel } from "../../utils/chat.adapter";

export const SearchResults = ({ results, loading, onSelectUser }) => {
  if (loading) {
    return <Loader className={styles.loader} />;
  }

  if (!results.length) {
    return <div className={styles.emptyHint}>Пользователи не найдены</div>;
  }

  return (
    <div className={styles.listContainer}>
      <div className={styles.sectionHeader}>Результаты поиска</div>
      {results.map((foundUser) => (
        <div
          key={foundUser.id}
          className={styles.chatItem}
          onClick={() => onSelectUser(foundUser)}
        >
          <div className={styles.avatar}>
            {foundUser.nickname?.[0]?.toUpperCase() || "?"}
          </div>

          <div className={styles.chatInfo}>
            <div className={styles.chatHeader}>
              <span className={styles.chatTitle}>{foundUser.nickname}</span>
            </div>
            <span className={styles.lastMsg}>{foundUser.email}</span>
            {foundUser.chatId && foundUser.isOnline !== undefined && (
              <span className={styles.lastMsg}>
                {formatPresenceLabel({
                  isOnline: foundUser.isOnline,
                  lastSeen: foundUser.lastSeen,
                })}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
