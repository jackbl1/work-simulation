import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Heading,
  VStack,
  Flex,
  Text,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { keyframes } from "@emotion/react";

interface TranscriptPanelProps {
  transcript: SharedTypes.TranscriptData;
  setTranscript: React.Dispatch<
    React.SetStateAction<SharedTypes.TranscriptData>
  >;
  loading: boolean;
  error: string | null;
}

export const TranscriptPanel = ({
  transcript,
  setTranscript,
  loading: isTranscriptLoading,
  error,
}: TranscriptPanelProps) => {
  const [isFixed, setIsFixed] = useState(false);
  const [fixTranscriptLoading, setFixTranscriptLoading] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const fixTranscript = async () => {
    try {
      setFixTranscriptLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/fix-transcript`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      console.log(data);
      setTranscript(data);
      setIsFixed(true);
    } catch (error) {
      console.error("Error fixing transcript:", error);
    } finally {
      setFixTranscriptLoading(false);
    }
  };

  // Determine which state to show (in order of priority)
  const showError = !!error;
  const showFixLoading = fixTranscriptLoading;
  const showTranscriptLoading = isTranscriptLoading;
  const showTranscript =
    !showError && !showFixLoading && !showTranscriptLoading;

  return (
    <VStack h="full" spacing={0} align="stretch">
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
        <Heading size="sm" color="gray.700" flex="1">
          Document Content
        </Heading>

        {!isFixed && (
          <Tooltip
            content="This transcript appears to have some lines misattributed to the wrong speaker. Click here to fix with our AI agent."
            showArrow
          >
            <Button
              colorScheme="blue"
              size="sm"
              onClick={fixTranscript}
              variant="outline"
              disabled={showFixLoading}
              loadingText="Fixing..."
              minW="110px"
            >
              Fix Transcript
            </Button>
          </Tooltip>
        )}
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
        {showError ? (
          <Text color="red.500" textAlign="center" py={8}>
            {error ?? "An error occurred while loading the transcript."}
          </Text>
        ) : showFixLoading ? (
          <LoadingState text="Fixing transcript..." />
        ) : showTranscriptLoading ? (
          <LoadingState text="Loading transcript..." />
        ) : (
          transcript?.chunkData?.map((chunk) => (
            <Box
              key={chunk.id}
              id={chunk.id.toString()}
              mb={4}
              p={4}
              borderRadius="lg"
              bg={chunk.speaker === "0" ? "blue.50" : "gray.50"}
              borderLeftWidth="4px"
              borderLeftColor={chunk.speaker === "0" ? "blue.200" : "gray.200"}
              _hover={{
                bg: chunk.speaker === "0" ? "blue.100" : "gray.100",
                transform: "translateX(2px)",
                transition: "all 0.2s",
              }}
            >
              <Box position="relative" width="100%">
                <Flex justify="space-between" align="flex-start" mb={1}>
                  <Text fontWeight="medium" color="gray.700">
                    {chunk.speaker === "0" ? "Therapist" : "Patient"}
                  </Text>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    bg="white"
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    border="1px"
                    borderColor="gray.200"
                  >
                    {chunk.id}
                  </Text>
                </Flex>
                <Text color="gray.800" whiteSpace="pre-line" mt={2}>
                  {chunk.text}
                </Text>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </VStack>
  );
};

const LoadingState = ({ text }: { text: string }) => {
  const pulse = keyframes`
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  `;
  const loadingAnimation = `${pulse} 1.5s ease-in-out infinite`;
  return (
    <HStack align="center" justify="center" w="full">
      <Spinner size="sm" />
      <Text
        color="gray.500"
        animation={loadingAnimation}
        textAlign="center"
        py={8}
      >
        {text}
      </Text>
    </HStack>
  );
};
