import { useChat } from "@/contexts/chatContext";
import { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";

interface ServerMessage {
  user: string;
  message: string;
  timestamp: Date;
}

interface PrivateMessage {
  from: string;
  message: string;
  timestamp: Date;
}

const socket = io("http://localhost:3001", {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const { addMessage, chats, addChat, user, setUser } = useChat();
  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>([]);
  const socketInitialized = useRef(false);

  const createMessage = useCallback(
    (recipient: string, message: string, sender: string) => {
      const chatExist = chats.find((el) => el.recipient === recipient);

      if (!chatExist) {
        addChat({
          messages: [],
          recipient,
          type: "private",
          isCurrentChat: true,
        });
      }

      addMessage(recipient, {
        content: message,
        sender,
        timestamp: new Date().toLocaleTimeString(),
      });
    },
    [addChat, addMessage, chats]
  );

  const logout = useCallback(() => {
    setIsConnected(false);
    setUser(null);
  }, [setUser]);

  useEffect(() => {
    if (socketInitialized.current) return;
    socketInitialized.current = true;

    const onConnect = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("Disconnected from WebSocket");
      logout();
    };

    const onConnectError = (error: Error) => {
      console.log("Connection error:", error);
      logout();
    };

    const onNewMessage = (message: ServerMessage) => {
      console.log("New public message received:", message);
      setMessages((prev) => [...prev, message]);

      if (user?.nick) {
        createMessage("Public", message.message, message.user);
      }
    };

    const onPrivateMessage = (message: PrivateMessage) => {
      console.log("New private message received:", message);
      setPrivateMessages((prev) => [...prev, message]);
      if (user?.nick) {
        createMessage(message.from, message.message, message.from);
      }
    };

    socket.removeAllListeners();

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("newMessage", onNewMessage);
    socket.on("privateMessage", onPrivateMessage);

    setIsConnected(socket.connected);

    return () => {
      socket.removeAllListeners();
      socketInitialized.current = false;
    };
  }, [user, createMessage, logout]);

  const sendMessage = (message: string) => {
    if (socket?.connected) {
      socket.emit("sendMessage", message);
    }
  };

  const setNickname = (nick: string, name: string) => {
    if (socket?.connected && socket.id) {
      socket.emit("setNick", nick);
      setUser({ id: socket.id, nick, name });
    }
  };

  const sendPrivateMessage = (recipient: string, message: string) => {
    if (socket?.connected && user?.nick) {
      socket.emit("privateMessage", { recipient, message });
      createMessage(recipient, message, user.nick);
    }
  };

  return {
    isConnected,
    messages,
    privateMessages,
    sendMessage,
    sendPrivateMessage,
    setNickname,
    logout,
  };
}
