import { AuthContext } from "./AuthContext";
import { accessTokenService } from "../services/accessTokenService";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const accessToken = accessTokenService.get();

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

        if (eventName === "new_message") {
          setIncomingMessage(data);
        }
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
  }, [user, accessToken]);

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
      incomingMessage,
      joinChat,
      sendMessage,
    }),
    [isConnected, incomingMessage, joinChat, sendMessage],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
