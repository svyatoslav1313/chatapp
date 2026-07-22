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
} from "../../utils/chat.adapter"; // 👈 Импортируем оба маппера
import styles from "./MainPage.module.scss";

const MOCK_ROOMS = [
  {
    id: 101,
    name: "General Chat",
    members: 142,
    desc: "Main public room for everyone",
  },
  {
    id: 102,
    name: "React & Tech",
    members: 58,
    desc: "Frontend discussions & architecture",
  },
  { id: 103, name: "Random & Memes", members: 89, desc: "Off-topic lounge" },
];

export const MainPage = () => {
  const { user, logout } = useContext(AuthContext);
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("direct");
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState([]); // Хранит список постоянных чатов
  const [searchResults, setSearchResults] = useState([]); // 👈 Отдельный стейт для поиска
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const selectedChat = chats.find((c) => String(c.id) === String(chatId));

  const filteredRooms = MOCK_ROOMS.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleSelectChat = (selectedChatId) => {
    navigate(`/main/${selectedChatId}`);
  };

  // 👈 Логика клика по найденному в поиске пользователю
  const handleSelectUser = async (foundUser) => {
    try {
      let targetChatId = foundUser.chatId;

      // Если чата с юзером ещё нет на фронтенде — запрашиваем/создаём его на бэкенде
      if (!targetChatId) {
        const rawChat = await chatService.createDirectChat(foundUser.id);
        const formattedChat = mapChatToViewModel(rawChat, user.id);

        // Добавляем новый чат в начало списка
        setChats((prev) => [formattedChat, ...prev]);

        targetChatId = formattedChat.id;
      }

      setSearchQuery(""); // Сбрасываем поиск, чтобы вернуть обычный список чатов
      navigate(`/main/${targetChatId}`);
    } catch (error) {
      console.error("Ошибка при открытии чата из поиска:", error);
    }
  };

  // Загрузка постоянных чатов пользователя
  useEffect(() => {
    if (!user?.id) return;

    chatService.getChats().then((rawChats) => {
      const formatted = mapChatsToViewModel(rawChats, user.id);
      setChats(formatted);
    });
  }, [user?.id]);

  // Глобальный поиск при вводе в инпут
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoadingSearch(true);

    const timerId = setTimeout(() => {
      chatService
        .searchUsers(searchQuery)
        .then((res) => {
          setSearchResults(res || []);
        })
        .finally(() => setLoadingSearch(false));
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <SidebarHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        {/* Если есть поисковый запрос — показываем SearchResults, иначе — ChatList */}
        {searchQuery.trim() ? (
          <SearchResults
            results={searchResults}
            onSelectUser={handleSelectUser}
            loading={loadingSearch}
          />
        ) : (
          <ChatList
            activeTab={activeTab}
            chats={chats}
            rooms={filteredRooms}
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

      {/* Модальное окно настроек */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};
