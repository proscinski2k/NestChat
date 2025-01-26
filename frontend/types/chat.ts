export interface User {
  name: string;
  nickname: string;
}

export interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

export interface Chat {
  recipient: string;
  messages: Message[];
  isCurrentChat: boolean;
  type: "private" | "public";
}

export interface ServerMessage {
  user: string;
  message: string;
  timestamp: Date;
}

export interface PrivateMessage {
  from: string;
  message: string;
  timestamp: Date;
}
