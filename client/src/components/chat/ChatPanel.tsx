import { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  IconButton,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight, FiTrash2 } from "react-icons/fi";
import { ChatMessage, LoadingMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Tooltip } from "../ui/tooltip";
import { toaster } from "../ui/toaster";

export interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
}

interface ChatPanelProps {
  transcript: SharedTypes.TranscriptData;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const ChatPanel = ({
  transcript,
  isCollapsed,
  onToggleCollapse,
}: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuery, setInputQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (content: string) => {
    setIsSubmitting(true);
    const userMessage: Message = { role: "user", content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputQuery("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: content,
          history: messages,
          transcript: transcript.chunkData,
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

      if (!data || !data.response) {
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
      const errorMessage = "Failed to send message, please try again";
      toaster.create({
        title: "Error sending message",
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isCollapsed) {
    return (
      <Box
        position="absolute"
        right="0"
        top="0"
        h="100%"
        bg="white"
        borderLeftWidth="1px"
        borderColor="gray.200"
        boxShadow="md"
        zIndex={1}
        width="40px"
      >
        <IconButton
          aria-label="Expand chat"
          onClick={onToggleCollapse}
          variant="ghost"
          size="sm"
          mt={2}
          borderRadius="full"
        >
          <FiChevronLeft />
        </IconButton>
      </Box>
    );
  }

  return (
    <VStack
      h="full"
      spacing={0}
      align="stretch"
      position="relative"
      bg="white"
      borderLeftWidth="1px"
      borderColor="gray.200"
      boxShadow="md"
    >
      <Flex
        pl={4}
        pr={2}
        py={2}
        bg="white"
        borderBottomWidth="1px"
        borderColor="gray.200"
        justify="space-between"
        align="center"
      >
        <Heading size="sm" color="gray.700">
          Chat
        </Heading>
        <HStack spacing={2}>
          <Tooltip content="Clear chat history" showArrow>
            <IconButton
              aria-label="Clear chat"
              onClick={handleClearChat}
              size="sm"
              variant="ghost"
              borderRadius="full"
            >
              <FiTrash2 />
            </IconButton>
          </Tooltip>
          <Tooltip content="Minimize chat" showArrow>
            <IconButton
              aria-label="Minimize chat"
              onClick={onToggleCollapse}
              size="sm"
              variant="ghost"
              borderRadius="full"
            >
              <FiChevronRight />
            </IconButton>
          </Tooltip>
        </HStack>
      </Flex>

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
        <VStack spacing={4} align="stretch" h="100%" overflowY="auto" p={4}>
          <Box flex="1">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isSubmitting && (
              <LoadingMessage
                message={{
                  role: "assistant",
                  content: "Thinking...",
                }}
              />
            )}
            <div ref={messagesEndRef} />
          </Box>
        </VStack>
      </Box>

      <Box p={4} borderTopWidth="1px" borderColor="gray.200" bg="white">
        <ChatInput
          query={inputQuery}
          setQuery={setInputQuery}
          onSendMessage={handleSendMessage}
          isSubmitting={isSubmitting}
        />
      </Box>
    </VStack>
  );
};
