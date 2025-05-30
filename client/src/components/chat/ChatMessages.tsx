import { useMemo } from "react";
import {
  Box,
  HStack,
  Text,
  VStack,
  Link,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import type { Message } from "@/hooks/useChat";
import { keyframes } from "@emotion/react";

interface ChatMessagesProps {
  messages: Message[];
  isSubmitting: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement> | null;
}

export const ChatMessages = ({
  messages,
  isSubmitting,
  messagesEndRef,
}: ChatMessagesProps) => {
  return useMemo(
    () => (
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
        <VStack align="stretch" h="100%" overflowY="auto" p={4}>
          <Box flex="1">
            {messages.map((message, index) => {
              return (
                <ChatMessage
                  key={`${message.role}-${index}`}
                  message={message}
                />
              );
            })}
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
    ),
    [messages, isSubmitting, messagesEndRef]
  );
};

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === "assistant";
  const bgColor = isAssistant ? "blue.50" : "gray.50";
  const alignSelf = isAssistant ? "flex-start" : "flex-end";
  const borderRadius = isAssistant ? "0 8px 8px 8px" : "8px 0 8px 8px";

  return (
    <VStack align={isAssistant ? "flex-start" : "flex-end"} width="100%">
      <Text
        fontSize="xs"
        color="gray.500"
        textTransform="capitalize"
        alignSelf={alignSelf}
      >
        {message.role}
      </Text>
      <Box
        bg={bgColor}
        p={3}
        borderRadius={borderRadius}
        maxWidth="80%"
        boxShadow="sm"
      >
        <Text whiteSpace="pre-wrap">
          {message.content}
          {message.citations && message.citations.length > 0 && (
            <Box mt={2}>
              <Wrap>
                {message.citations.map((citation) => (
                  <WrapItem key={citation}>
                    <Link
                      color="blue.500"
                      onClick={() => {
                        const element = document.getElementById(citation);
                        if (element) {
                          element.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                          element.classList.add("highlight-citation");
                          setTimeout(() => {
                            element.classList.remove("highlight-citation");
                          }, 2000);
                        }
                      }}
                      _hover={{
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      fontSize="sm"
                      whiteSpace="nowrap"
                    >
                      {citation}
                    </Link>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          )}
        </Text>
      </Box>
    </VStack>
  );
};

export const LoadingMessage = ({ message }: { message: Message }) => {
  const bounce = keyframes`
    0%, 80%, 100% { 
      transform: scale(0.2);
    } 
    40% { 
      transform: scale(0.8);
    }
  `;

  return (
    <VStack align="flex-start" width="100%">
      <Text fontSize="xs" color="gray.500" textTransform="capitalize" mb={1}>
        {message.role}
      </Text>
      <HStack
        bg="blue.50"
        p={3}
        borderRadius="lg"
        maxWidth="80%"
        align="center"
        height="40px"
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            as="span"
            width="8px"
            height="8px"
            borderRadius="50%"
            bg="gray.400"
            display="inline-block"
            animation={`${bounce} 1.4s infinite ease-in-out ${i * 0.16}s`}
            style={{
              animationFillMode: "both",
            }}
          />
        ))}
      </HStack>
    </VStack>
  );
};
