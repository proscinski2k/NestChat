"use client";

import { UserOnboarding } from "@/components/chat/UserOnboarding";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { useChat } from "@/contexts/chatContext";

export default function Home() {
  const { user } = useChat();

  return <main>{!user ? <UserOnboarding /> : <ChatLayout />}</main>;
}
