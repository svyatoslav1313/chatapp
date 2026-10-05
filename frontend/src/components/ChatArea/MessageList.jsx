import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { messageService } from "../../services/messageService.js";
import styles from "./MessageList.module.scss";
import {
  formatDayLabel,
  formatMessageClock,
} from "../../utils/chat.adapter.js";
import { useSocket } from "../../Context/useSocket";
import { ChevronDown, Trash } from "lucide-react";

// Сообщения одного автора с паузой меньше этой склеиваются в группу
const GROUP_GAP_MS = 5 * 60 * 1000;
const BOTTOM_THRESHOLD = 80;
const SKELETON_WIDTHS = ["45%", "30%", "55%", "25%", "40%", "35%"];

const emojiOnlyPattern =
  /^(?:\p{Extended_Pictographic}[\p{Emoji_Modifier}️‍]*|\s)+$/u;

const isEmojiOnly = (text) => {
  if (!emojiOnlyPattern.test(text)) {
    return false;
  }

  const count = text.match(/\p{Extended_Pictographic}/gu)?.length || 0;

  return count > 0 && count <= 3;
};

const isSameDay = (left, right) =>
  new Date(left).toDateString() === new Date(right).toDateString();

const isSameGroup = (left, right) =>
  Boolean(left && right) &&
  left.senderId === right.senderId &&
  isSameDay(left.createdAt, right.createdAt) &&
  Math.abs(new Date(right.createdAt) - new Date(left.createdAt)) <
    GROUP_GAP_MS;

export const MessageList = ({ userId, chatId, chatTitle, isPartnerTyping }) => {
  const { onMessage, deleteMessage, onMessageDelete } = useSocket();
  const containerRef = useRef(null);
  const isAtBottomRef = useRef(true);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newCount, setNewCount] = useState(0);

  const scrollToBottom = useCallback((behavior = "auto") => {
    const container = containerRef.current;

    container?.scrollTo({ top: container.scrollHeight, behavior });
  }, []);

  const handleScroll = () => {
    const container = containerRef.current;
    const distance =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    const atBottom = distance < BOTTOM_THRESHOLD;

    isAtBottomRef.current = atBottom;
    setIsAtBottom(atBottom);

    if (atBottom) {
      setNewCount(0);
    }
  };

  useEffect(() => {
    messageService
      .getMessages(chatId)
      .then((res) => setMessages(res))
      .finally(() => setIsLoading(false));
  }, [chatId]);

  useLayoutEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [isLoading, scrollToBottom]);

  useEffect(() => {
    const unsubscribe = onMessage((incomingMessage) => {
      if (incomingMessage && incomingMessage.chatId === chatId) {
        setMessages((prev) => [...prev, incomingMessage]);

        // Не сбиваем чтение истории: чужое сообщение только увеличивает счётчик
        if (incomingMessage.senderId === userId || isAtBottomRef.current) {
          requestAnimationFrame(() => scrollToBottom("smooth"));
        } else {
          setNewCount((count) => count + 1);
        }
      }
    });

    return unsubscribe;
  }, [chatId, userId, onMessage, scrollToBottom]);

  useEffect(() => {
    const unsubscribe = onMessageDelete(({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageId),
      );
    });

    return unsubscribe;
  }, [onMessageDelete]);

  useEffect(() => {
    if (isPartnerTyping && isAtBottomRef.current) {
      scrollToBottom("smooth");
    }
  }, [isPartnerTyping, scrollToBottom]);

  return (
    <div className={styles.messagesWrap}>
      <div
        ref={containerRef}
        className={styles.messagesContainer}
        onScroll={handleScroll}
      >
        {isLoading &&
          SKELETON_WIDTHS.map((width, index) => (
            <div key={index} className={styles.skeleton} style={{ width }} />
          ))}

        {!isLoading && messages.length === 0 && (
          <div className={styles.emptyChat}>
            <span className={styles.emptyTitle}>No messages yet</span>
            <span>Say hi to {chatTitle} 👋</span>
          </div>
        )}

        {messages.map((message, index) => {
          const prevMessage = messages[index - 1];
          const nextMessage = messages[index + 1];
          const isOwn = message.senderId === userId;
          const startsDay =
            !prevMessage ||
            !isSameDay(prevMessage.createdAt, message.createdAt);

          const className = [
            styles.message,
            isOwn ? styles.outgoing : styles.incoming,
            isSameGroup(prevMessage, message) ? styles.joinPrev : "",
            isSameGroup(message, nextMessage) ? styles.joinNext : "",
            isEmojiOnly(message.text || "") ? styles.emojiOnly : "",
          ].join(" ");

          return (
            <Fragment key={message.id}>
              {startsDay && (
                <div className={styles.daySeparator}>
                  <span>{formatDayLabel(message.createdAt)}</span>
                </div>
              )}
              <div className={className}>
                {isOwn && (
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    title="Delete message"
                    aria-label="Delete message"
                    onClick={() => deleteMessage(chatId, message.id)}
                  >
                    <Trash size={14} />
                  </button>
                )}
                <div className={styles.msgContent}>
                  <span className={styles.msgText}>{message.text}</span>
                  <span className={styles.msgTime}>
                    {formatMessageClock(message.createdAt)}
                  </span>
                </div>
              </div>
            </Fragment>
          );
        })}

        {isPartnerTyping && (
          <div className={styles.typingBubble} aria-label="Typing">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      {!isAtBottom && (
        <button
          type="button"
          className={styles.jumpButton}
          title="Scroll to latest"
          aria-label="Scroll to latest"
          onClick={() => scrollToBottom("smooth")}
        >
          <ChevronDown size={20} />
          {newCount > 0 && <span className={styles.jumpBadge}>{newCount}</span>}
        </button>
      )}
    </div>
  );
};
