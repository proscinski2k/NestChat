import { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  return (
    <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
      <p className="text-sm text-muted-foreground mb-1 px-1">{message.sender}</p>
      <div
        className={`max-w-md p-3 rounded-lg ${
          isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        <p>{message.content}</p>
        <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
      </div>
    </div>
  );
}