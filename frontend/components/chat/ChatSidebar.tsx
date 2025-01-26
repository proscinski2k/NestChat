import { KeyboardEvent, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/contexts/chatContext";

export function ChatSidebar() {
  const [showNewChatInput, setShowNewChatInput] = useState<boolean>(false);
  const [newChatNickname, setNewChatNickname] = useState<string>("");
  const { addChat, chats, currentChat, setCurrentChat } = useChat();

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onCreateNewChat();
    if (e.key === "Escape") setShowNewChatInput(false);
  };

  const onCreateNewChat = () => {
    if (!newChatNickname.trim()) return;

    addChat({
      messages: [],
      recipient: newChatNickname,
      type: "private",
      isCurrentChat: true,
    });

    setNewChatNickname("");
  };

  return (
    <div className="w-64 border-r p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Chats</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowNewChatInput(!showNewChatInput)}
        >
          {showNewChatInput ? (
            <Minus className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </Button>
      </div>

      {showNewChatInput && (
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Enter nickname"
            value={newChatNickname}
            onChange={(event) => {
              setNewChatNickname(event.target.value);
            }}
            onKeyDown={handleKeyPress}
            autoFocus
          />
          <Button onClick={onCreateNewChat} size="sm">
            Add
          </Button>
        </div>
      )}

      <ScrollArea>
        <div className="pr-4">
          {chats.map((chat, index) => (
            <div
              key={index}
              onClick={() => {
                setCurrentChat(chat);
              }}
              className={`p-3 cursor-pointer rounded-lg mb-2 ${
                currentChat?.recipient === chat.recipient
                  ? "bg-muted"
                  : "hover:bg-muted/50"
              }`}
            >
              <p className="font-medium">{chat.recipient}</p>
              <p className="text-sm text-muted-foreground truncate">
                {chat.messages[chat.messages.length - 1]?.content ||
                  "No messages yet"}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
