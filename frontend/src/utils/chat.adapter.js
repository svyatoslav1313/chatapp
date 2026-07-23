const formatChatTime = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (isYesterday) {
    return "Вчера";
  }

  return date.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
};

const formatLastSeen = (isoString) => {
  if (!isoString) {
    return "";
  }

  const date = new Date(isoString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return `Last seen today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  return `Last seen ${date.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}`;
};

export const formatMessageTime = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return time;
  }

  const formattedDate = date.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `${formattedDate}, ${time}`;
};

/**
 * Адаптирует сырой объект Chat из API под удобную ViewModel для UI
 */
export const mapChatToViewModel = (chat, currentUserId) => {
  const isDirect = chat.type === "direct";

  // 1. Определяем собеседника (для личек)
  const partner = isDirect
    ? chat.users?.find((u) => u.id !== currentUserId)
    : null;

  // 2. Имя чата
  const title = isDirect
    ? partner?.nickname || "Неизвестный пользователь"
    : chat.name || "Публичная комната";

  // 3. Последнее сообщение
  const lastMsgObj = chat.messages?.[0] || null;
  const lastMsgText = lastMsgObj ? lastMsgObj.text : "Сообщений пока нет";

  // 4. Кто автор последнего сообщения
  let senderPrefix = "";
  if (lastMsgObj) {
    const isMyMessage = lastMsgObj.senderId === currentUserId;
    senderPrefix = isMyMessage ? "You: " : `${lastMsgObj.sender?.nickname}: `;
  }

  return {
    id: chat.id,
    type: chat.type,
    title,
    time: formatChatTime(lastMsgObj?.createdAt || chat.createdAt),
    lastMessageText: lastMsgText,
    senderPrefix,
    unreadCount: 0, // Можно расширить, когда добавится счетчик непрочитанных
    avatarLetter: title[0]?.toUpperCase() || "?",
    partnerId: partner?.id || null,
    online: Boolean(partner?.isOnline),
    lastSeen: partner?.lastSeen || null,
    presenceLabel: partner?.isOnline
      ? "Online"
      : formatLastSeen(partner?.lastSeen),
    raw: chat, // На случай, если компоненту понадобится исходник
  };
};

/**
 * Маппер для массива чатов
 */
export const mapChatsToViewModel = (chats = [], currentUserId) => {
  const formatted = chats.map((chat) =>
    mapChatToViewModel(chat, currentUserId),
  );

  return formatted.sort((a, b) => {
    // Достаем дату последнего сообщения или создания чата для A
    const timeA = new Date(
      a.raw.messages?.[0]?.createdAt || a.raw.createdAt,
    ).getTime();

    // Достаем дату последнего сообщения или создания чата для B
    const timeB = new Date(
      b.raw.messages?.[0]?.createdAt || b.raw.createdAt,
    ).getTime();

    // Сортируем от самых новых к более старым (DESC)
    return timeB - timeA;
  });
};
