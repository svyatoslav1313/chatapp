import React from "react";
import { Search, Settings, MessageSquare, Users } from "lucide-react";
import styles from "./SidebarHeader.module.scss";

export const SidebarHeader = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  onOpenSettings, // <-- Проп открытия настроек
}) => {
  return (
    <>
      <div className={styles.sidebarHeader}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>A</div>
          <div className={styles.userText}>
            <span className={styles.userName}>Alexander</span>
            <span className={styles.userStatus}>Online</span>
          </div>
        </div>
        <button
          className={styles.iconButton}
          title="Settings"
          onClick={onOpenSettings} // <-- Кликом открываем модалку
        >
          <Settings size={18} />
        </button>
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
        <button
          className={`${styles.tabBtn} ${activeTab === "direct" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("direct")}
        >
          <MessageSquare size={16} />
          <span>Direct</span>
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "rooms" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("rooms")}
        >
          <Users size={16} />
          <span>Public Rooms</span>
        </button>
      </div>
    </>
  );
};
