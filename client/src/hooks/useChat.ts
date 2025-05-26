import { toaster } from "@/components/ui/toaster";
import { useState, useEffect, useRef } from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log("chat messages in useChat is", messages);

  const sendMessage = async (
    content: string,
    transcriptData: SharedTypes.TranscriptData
  ) => {
    setIsSubmitting(true);
    const userMessage: Message = { role: "user", content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: content,
          history: messages,
          transcript: transcriptData.chunkData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
            `Request failed with status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data?.response) {
        throw new Error("Invalid response format from server");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        citations: data.citations,
      };

      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toaster.create({
        title: "Error sending message",
        description: "Failed to send message, please try again",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return {
    messages,
    isSubmitting,
    sendMessage,
    clearMessages,
    messagesEndRef,
  };
};
