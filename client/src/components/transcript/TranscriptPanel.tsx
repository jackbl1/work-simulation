import React from "react";
import { Box, Button, Heading, VStack, Flex } from "@chakra-ui/react";

interface TranscriptPanelProps {
  transcript: string;
}

export const TranscriptPanel = ({ transcript }: TranscriptPanelProps) => {
  const documentRef = React.useRef<HTMLDivElement>(null);

  const fixTranscript = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/fix-transcript`
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fixing transcript:", error);
    }
  };

  return (
    <VStack h="full" spacing={0} align="stretch">
      <Flex
        p={4}
        bg="white"
        borderBottomWidth="1px"
        borderColor="gray.200"
        justify="space-between"
        align="center"
      >
        <Heading size="md" color="gray.700">
          Document Content
        </Heading>

        <Button
          colorScheme="blue"
          size="sm"
          onClick={fixTranscript}
          variant="outline"
        >
          Fix Transcript
        </Button>
      </Flex>
      <Box
        ref={documentRef}
        h="full"
        overflowY="auto"
        p={6}
        color="gray.700"
        lineHeight="relaxed"
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
          scrollBehavior: "smooth",
        }}
      >
        {transcript}
      </Box>
    </VStack>
  );
};
