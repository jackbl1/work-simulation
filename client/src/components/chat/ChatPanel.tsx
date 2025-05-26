import { Box, VStack, IconButton } from "@chakra-ui/react";
import { FiChevronLeft } from "react-icons/fi";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { useChat } from "@/hooks/useChat";
import { useTranscript } from "@/hooks/useTranscript";

interface ChatPanelProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const ChatPanel = ({
  isCollapsed,
  onToggleCollapse,
}: ChatPanelProps) => {
  const { transcript } = useTranscript();
  const { messages, sendMessage, isSubmitting, messagesEndRef, clearMessages } =
    useChat();

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
      align="stretch"
      position="relative"
      bg="white"
      borderLeftWidth="1px"
      borderColor="gray.200"
      boxShadow="md"
    >
      <ChatHeader
        onToggleCollapse={onToggleCollapse}
        clearMessages={clearMessages}
      />
      <ChatMessages
        messages={messages}
        isSubmitting={isSubmitting}
        messagesEndRef={messagesEndRef}
      />
      <ChatInput
        sendMessage={sendMessage}
        isSubmitting={isSubmitting}
        transcript={transcript}
      />
    </VStack>
  );
};
