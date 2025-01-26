import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { useEffect, useRef } from "react";
import { useChat } from "@/contexts/chatContext";

export function ChatMessages() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, currentChat } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {currentChat?.messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isCurrentUser={message.sender === user?.nick}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
