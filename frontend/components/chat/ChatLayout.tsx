import { ChatSidebar } from "./ChatSidebar";
import { ChatMessages } from "./ChatMessages";
import { MessageInput } from "./MessageInput";
import { NavBar } from "./NavBar";
import { useSocket } from "@/hooks/useSocketChat";
import { useChat } from "@/contexts/chatContext";

export function ChatLayout() {
  const { isConnected } = useSocket();
  const { currentChat } = useChat();

  return (
    <div className="flex flex-col h-screen bg-background">
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />

        <div className="flex-1 flex flex-col">
          {currentChat ? (
            <>
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">
                  {currentChat.recipient}
                  {!isConnected && " (Disconnected)"}
                </h3>
              </div>

              <ChatMessages />

              <MessageInput />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">
                Select a chat or start a new conversation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
