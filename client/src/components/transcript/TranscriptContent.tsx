import React from "react";
import { Box, Flex, HStack, Spinner, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

interface TranscriptContentProps {
  transcript: SharedTypes.TranscriptData | undefined;
  isFixing: boolean;
  isLoading: boolean;
  transcriptError: string | null;
}

export const TranscriptContent = ({
  transcript,
  isFixing,
  isLoading,
  transcriptError,
}: TranscriptContentProps) => {
  const documentRef = React.useRef<HTMLDivElement>(null);
  const showError = !!transcriptError;

  return (
    <Box
      ref={documentRef}
      h="full"
      overflowY="scroll"
      p={6}
      color="gray.700"
      lineHeight="relaxed"
      sx={{
        "&::-webkit-scrollbar": {
          width: "8px",
          visibility: "visible",
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
          {transcriptError || "An error occurred while loading the transcript."}
        </Text>
      ) : isFixing ? (
        <LoadingState text="Fixing transcript..." />
      ) : isLoading ? (
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
