import { useState, FormEvent, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/types/chat";
import { useSocket } from "@/hooks/useSocketChat";

export function UserOnboarding() {
  const { isConnected, setNickname } = useSocket();
  const [formData, setFormData] = useState<User>({
    name: "",
    nickname: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.name && formData.nickname && isConnected) {
      setNickname(formData.nickname, formData.name);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to Chat
            {!isConnected && (
              <p className="text-sm text-muted-foreground mt-2">
                Connecting to server...
              </p>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none"
              >
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                disabled={!isConnected}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="nickname"
                className="text-sm font-medium leading-none"
              >
                Nickname
              </label>
              <Input
                id="nickname"
                type="text"
                value={formData.nickname}
                onChange={handleInputChange}
                placeholder="Choose a nickname"
                required
                disabled={!isConnected}
              />
            </div>
            <Button type="submit" className="w-full" disabled={!isConnected}>
              Start Chatting
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
