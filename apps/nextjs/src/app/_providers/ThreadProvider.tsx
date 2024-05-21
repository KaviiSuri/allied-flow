"use client"
import { createContext, useContext, useState } from "react";

export interface Message {
  text: string;
  sending: boolean;
  key: number;
}

interface ThreadContext {
  messages: Message[],
  sendMessage: (_: string) => Promise<void>
}

const threadContext = createContext<ThreadContext>({
  messages: [],
  sendMessage: async () => {/* empty */ }
})

export function useThreads() {
  return useContext(threadContext)
}

export async function deliverMessage(message: string) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}

export default function ThreadsProvider({ children }: React.PropsWithChildren) {
  const [messages, setMessages] = useState<Message[]>([]);

  async function sendMessage(message: string) {
    const sentMessage = await deliverMessage(message);
    setMessages((m) => [...m, { text: sentMessage, sending: false, key: m.length }])
  }

  return (
    <threadContext.Provider
      value={{
        messages,
        sendMessage
      }}
    >
      {children}
    </threadContext.Provider>
  )
}
