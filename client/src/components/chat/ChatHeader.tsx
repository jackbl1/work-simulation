import { Flex, Heading, IconButton, HStack } from "@chakra-ui/react";
import { FiChevronRight, FiTrash2 } from "react-icons/fi";
import { Tooltip } from "../ui/tooltip";
import { useChat } from "../../hooks/useChat";

export const ChatHeader = ({
  onToggleCollapse,
}: {
  onToggleCollapse: () => void;
}) => {
  const { clearMessages } = useChat();
  return (
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
      <HStack>
        <Tooltip content="Clear chat history" showArrow>
          <IconButton
            aria-label="Clear chat"
            onClick={clearMessages}
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
  );
};
