import React, { useState } from "react";
import { Button, Flex, Input } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { toaster } from "../ui/toaster";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim()) {
      toaster.create({
        title: "Message cannot be empty",
        //status: "warning",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSendMessage(message);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toaster.create({
        title: "Failed to send message",
        description: "Please try again later.",
        // status: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <Flex gap={2} width="100%">
        <Input
          flex={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
          colorScheme="blue"
          isLoading={isSubmitting}
          rightIcon={<FiSend />}
          px={6}
        >
          Send
        </Button>
      </Flex>
    </form>
  );
};
