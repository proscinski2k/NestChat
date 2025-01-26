import { Chat, Message } from "@/types/chat";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface User {
  id: string;
  nick: string;
  name: string;
}

interface ChatContextType {
  user: User | null;
  chats: Chat[];
  currentChat: Chat | null;
  setCurrentChat: (chats: Chat) => void;
  setUser: (user: User | null) => void;
  addChat: (chat: Chat) => void;
  setChats: (chats: Chat[]) => void;
  addMessage: (chatId: string, message: Message) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([
    {
      recipient: "Public",
      messages: [],
      type: "public",
      isCurrentChat: true,
    }
  ]);
  const [currentChat, setCurrentChatFunc] = useState<Chat | null>(null);

  const addChat = (chat: Chat) => {
    setChats((prev) =>
      prev.find((el) => el.recipient == chat.recipient) ? prev : [...prev, chat]
    );
  };

  const addMessage = (recipient: string, message: Message) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.recipient === recipient
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    );
  };

  const setCurrentChat = (chat: Chat) => {
    const newChats = chats.map((el) => {
      if (el.recipient == chat.recipient) el.isCurrentChat = true;
      else el.isCurrentChat = false;
      return el;
    });

    setChats(newChats);
  };

  useEffect(() => {
    const currentChat = chats.find((el) => el.isCurrentChat) || null;
    setCurrentChatFunc(currentChat);
  }, [chats]);

  return (
    <ChatContext.Provider
      value={{
        user,
        chats,
        setChats,
        setCurrentChat,
        currentChat,
        setUser,
        addChat,
        addMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
