import React, { useState, useRef, useEffect } from "react";
import { Box, VStack, Heading } from "@chakra-ui/react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "user", content: "placeholder user message" },
    { role: "assistant", content: "placeholder assistant message" },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (content: string) => {
    // TODO: Implement actual message sending logic
    const newMessage: Message = { role: "user", content };
    setMessages([...messages, newMessage]);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <VStack h="full" spacing={0} align="stretch">
      <Box p={4} bg="white" borderBottomWidth="1px" borderColor="gray.200">
        <Heading size="md" color="gray.700">
          Chat
        </Heading>
      </Box>

      <Box
        flex="1"
        overflowY="auto"
        p={4}
        bg="white"
        sx={{
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "gray.50",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "gray.300",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "gray.400",
          },
        }}
      >
        <VStack spacing={4} align="stretch">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      <Box p={4} borderTopWidth="1px" borderColor="gray.200" bg="white">
        <ChatInput onSendMessage={handleSendMessage} />
      </Box>
    </VStack>
  );
};
