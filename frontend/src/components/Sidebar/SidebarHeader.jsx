import { Search, Settings, MessageSquare } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import styles from "./SidebarHeader.module.scss";

export const SidebarHeader = ({
  user,
  searchQuery,
  setSearchQuery,
  onOpenSettings,
}) => {
  return (
    <>
      <div className={styles.sidebarHeader}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.name[0].toUpperCase() || ""}
          </div>
          <div className={styles.userText}>
            <span className={styles.userName}>{user.name || ""}</span>
            <span className={styles.userStatus}>Online</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <ThemeToggle />
          <button
            className={styles.iconButton}
            title="Settings"
            aria-label="Settings"
            onClick={onOpenSettings}
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className={styles.searchBox}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by nickname or room..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabsContainer}>
        <button className={`${styles.tabBtn} ${styles.activeTab}`}>
          <MessageSquare size={14} />
          <span>Direct</span>
        </button>
      </div>
    </>
  );
};
