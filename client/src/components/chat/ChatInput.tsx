import React, { useState } from "react";
import { Button, Flex, Input, Box } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { toaster } from "../ui/toaster";

interface ChatInputProps {
  sendMessage: (
    query: string,
    transcript: SharedTypes.TranscriptData
  ) => Promise<void>;
  isSubmitting: boolean;
  transcript: SharedTypes.TranscriptData | undefined;
}

export const ChatInput = ({
  sendMessage,
  isSubmitting,
  transcript,
}: ChatInputProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) {
      toaster.create({
        title: "Message cannot be empty",
        duration: 3000,
      });
      return;
    }

    if (!transcript) {
      toaster.create({
        title: "Transcript not loaded",
        duration: 3000,
      });
      return;
    }

    await sendMessage(query, transcript);
    setQuery("");
  };

  return (
    <Box p={4} borderTopWidth="1px" borderColor="gray.200">
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Flex gap={2} width="100%" alignItems="center">
          <Input
            flex={1}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your message..."
            bg="white"
            borderColor="gray.300"
            _hover={{ borderColor: "blue.300" }}
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
            }}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            size="xs"
            colorScheme="blue"
            loading={isSubmitting}
            px={4}
          >
            Send
            <FiSend size="12" />
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
