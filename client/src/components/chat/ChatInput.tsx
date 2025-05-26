import React, { useState } from "react";
import { Button, Flex, Input } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { toaster } from "../ui/toaster";

interface ChatInputProps {
  query: string;
  setQuery: (query: string) => void;
  onSendMessage: (content: string) => void;
  isSubmitting: boolean;
}

export const ChatInput = ({
  query,
  setQuery,
  onSendMessage,
  isSubmitting,
}: ChatInputProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) {
      toaster.create({
        title: "Message cannot be empty",
        //status: "warning",
        duration: 3000,
      });
      return;
    }

    onSendMessage(query);
  };

  return (
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
  );
};
