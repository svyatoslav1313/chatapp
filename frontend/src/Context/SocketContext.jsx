import { AuthContext } from "./AuthContext";
import { accessTokenService } from "../services/accessTokenService";
import { SocketContext } from "./SocketContext";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const socketRef = useRef(null);
  const listenersRef = useRef(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = accessTokenService.get();

  const subscribe = useCallback((eventName, callback) => {
    if (!listenersRef.current.has(eventName)) {
      listenersRef.current.set(eventName, new Set());
    }

    listenersRef.current.get(eventName).add(callback);

    return () => {
      const listeners = listenersRef.current.get(eventName);

      if (!listeners) {
        return;
      }

      listeners.delete(callback);

      if (listeners.size === 0) {
        listenersRef.current.delete(eventName);
      }
    };
  }, []);

  const emit = useCallback((eventName, data) => {
    const listeners = listenersRef.current.get(eventName);

    if (!listeners) {
      return;
    }

    listeners.forEach((listener) => listener(data));
  }, []);

  const onMessage = useCallback(
    (callback) => subscribe("new_message", callback),
    [subscribe],
  );

  const onUserStatusChange = useCallback(
    (callback) => subscribe("user_status_changed", callback),
    [subscribe],
  );

  useEffect(() => {
    if (!user && !accessToken) {
      if (socketRef.current) {
        socketRef.current.close();
      }
      return;
    }

    const WS_URL = `${import.meta.env.VITE_WS_URL || "ws://localhost:3005"}?token=${accessToken}`;
    const ws = new WebSocket(WS_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("⚡ WebSocket connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const { event: eventName, data } = payload;

        emit(eventName, data);
      } catch (error) {
        console.error("Failed to parse WS message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (e) => {
      console.log(`❌ WebSocket closed (code: ${e.code})`);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [user, accessToken, emit]);

  const joinChat = useCallback((chatId) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          event: "join_chat",
          data: { chatId },
        }),
      );
    }
  }, []);

  const sendMessage = useCallback((chatId, chatType, text) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          event: "send_message",
          data: { chatId, chatType, text },
        }),
      );
    }
  }, []);

  const value = useMemo(
    () => ({
      isConnected,
      onMessage, // 👈 Передаём функцию подписки вместо incomingMessage
      onUserStatusChange,
      joinChat,
      sendMessage,
    }),
    [isConnected, onMessage, onUserStatusChange, joinChat, sendMessage],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
