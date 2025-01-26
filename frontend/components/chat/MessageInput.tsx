import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/hooks/useSocketChat";
import { useChat } from "@/contexts/chatContext";

export function MessageInput() {
  const { isConnected, sendMessage, sendPrivateMessage } = useSocket();
  const { currentChat } = useChat();

  const [value, setValue] = useState<string>("");

  const onSendMessage = () => {
    if (currentChat?.type == "public") {
      sendMessage(value);
    }
    if (currentChat?.type == "private" && currentChat?.recipient) {
      sendPrivateMessage(currentChat.recipient, value);
    }
    setValue("");
  };

  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Input
          placeholder="Type a message..."
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSendMessage();
            }
          }}
          disabled={!isConnected}
        />
        <Button onClick={onSendMessage} disabled={!isConnected}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
