import { LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/useSocketChat";
import { useChat } from "@/contexts/chatContext";

export function NavBar() {
  const { isConnected, logout } = useSocket();
  const { user } = useChat();

  return (
    <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-full flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <UserCircle className="h-6 w-6" />
          <span className="font-medium">{user?.name}</span>
          <span className="text-sm text-muted-foreground">({user?.nick})</span>
          <span
            className={`ml-2 h-2 w-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
