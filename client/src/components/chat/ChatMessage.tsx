import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import type { Message } from "./ChatPanel";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === "assistant";
  const bgColor = isAssistant ? "blue.50" : "gray.50";
  const alignSelf = isAssistant ? "flex-start" : "flex-end";
  const borderRadius = isAssistant ? "0 8px 8px 8px" : "8px 0 8px 8px";

  return (
    <VStack
      align={isAssistant ? "flex-start" : "flex-end"}
      width="100%"
      spacing={1}
    >
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
        <Text>{message.content}</Text>
      </Box>
    </VStack>
  );
};
