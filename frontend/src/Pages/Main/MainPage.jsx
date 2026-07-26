import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SidebarHeader } from "../../components/Sidebar/SidebarHeader";
import { ChatList } from "../../components/Sidebar/ChatList";
import { SearchResults } from "../../components/Sidebar/SearchResults"; // 👈 Новый компонент
import { ChatHeader } from "../../components/ChatArea/ChatHeader";
import { MessageList } from "../../components/ChatArea/MessageList";
import { MessageInput } from "../../components/ChatArea/MessageInput";
import { SettingsModal } from "../../components/Settings/SettingsModal";
import { AuthContext } from "../../Context/AuthContext";
import { chatService } from "../../services/chatService";
import {
  mapChatsToViewModel,
  mapChatToViewModel,
  formatPresenceLabel,
} from "../../utils/chat.adapter";
import styles from "./MainPage.module.scss";
import { useSocket } from "../../Context/useSocket";

export const MainPage = () => {
  const { user, logout } = useContext(AuthContext);
  const { onMessage, onUserStatusChange, onUserTyping } = useSocket();
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const selectedChat = chats.find((c) => String(c.id) === String(chatId));

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);

    if (query.trim()) {
      setLoadingSearch(true);
    } else {
      setLoadingSearch(false);
      setSearchResults([]);
    }
  };

  const handleSelectChat = (selectedChatId) => {
    navigate(`/main/${selectedChatId}`);
  };

  // 👈 Логика клика по найденному в поиске пользователю
  const handleSelectUser = async (foundUser) => {
    try {
      let targetChatId = foundUser.chatId;

      if (!targetChatId) {
        const rawChat = await chatService.createDirectChat(foundUser.id);
        const formattedChat = mapChatToViewModel(rawChat, user.id);

        setChats((prev) => [formattedChat, ...prev]);

        targetChatId = formattedChat.id;
      }

      setSearchQuery("");
      navigate(`/main/${targetChatId}`);
    } catch (error) {
      console.error("Ошибка при открытии чата из поиска:", error);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    chatService.getChats().then((rawChats) => {
      const formatted = mapChatsToViewModel(rawChats, user.id);
      setChats(formatted);
    });
  }, [user?.id]);

  useEffect(() => {
    const unsubscribe = onMessage((incomingMessage) => {
      if (incomingMessage) {
        setChats((prevChats) =>
          prevChats
            .map((chat) =>
              String(chat.id) === String(incomingMessage.chatId)
                ? {
                    ...chat,
                    lastMessageText: incomingMessage.text,
                    time: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    senderPrefix:
                      String(incomingMessage.senderId) === String(user.id)
                        ? "You: "
                        : "",
                  }
                : chat,
            )
            .sort((leftChat, rightChat) => {
              if (String(leftChat.id) === String(incomingMessage.chatId)) {
                return -1;
              }
              if (String(rightChat.id) === String(incomingMessage.chatId)) {
                return 1;
              }
              return 0;
            }),
        );
      }
    });

    // Отписываемся при размонтировании
    return unsubscribe;
  }, [user?.id, onMessage]);

  useEffect(() => {
    const unsubscribe = onUserStatusChange(({ userId, isOnline, lastSeen }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          String(chat.partnerId) === String(userId)
            ? {
                ...chat,
                online: isOnline,
                lastSeen,
                presenceLabel: formatPresenceLabel({ isOnline, lastSeen }),
              }
            : chat,
        ),
      );
    });

    return unsubscribe;
  }, [onUserStatusChange]);

  useEffect(() => {
    const unsubscribe = onUserTyping(({ chatId, userId, isTyping }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          String(chat.partnerId) === String(userId)
            ? {
                ...chat,
                partnerIsTyping: isTyping,
              }
            : chat,
        ),
      );
    });

    return unsubscribe;
  }, [onUserTyping]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    const timerId = setTimeout(() => {
      chatService
        .searchUsers(searchQuery)
        .then((res) => {
          setSearchResults(res || []);
        })
        .catch((err) => {
          console.error("Search error:", err);
        })
        .finally(() => {
          setLoadingSearch(false);
        });
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <SidebarHeader
          user={user}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        {searchQuery.trim() ? (
          <SearchResults
            results={searchResults}
            onSelectUser={handleSelectUser}
            loading={loadingSearch}
          />
        ) : (
          <ChatList
            chats={chats}
            selectedChatId={chatId}
            onSelect={handleSelectChat}
          />
        )}
      </aside>

      <main className={styles.chatArea}>
        {chatId && selectedChat ? (
          <>
            <ChatHeader selectedChat={selectedChat} />
            <MessageList userId={user.id} chatId={selectedChat.id} />
            <MessageInput chatId={selectedChat.id} />
          </>
        ) : (
          <div className={styles.emptyState}>
            <p>Select a chat or public room to start messaging</p>
          </div>
        )}
      </main>

      <SettingsModal
        user={user}
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};
