import { VStack } from "@chakra-ui/react";
import { TranscriptHeader } from "./TranscriptHeader";
import { TranscriptContent } from "./TranscriptContent";
import { useTranscript } from "@/hooks/useTranscript";

export const TranscriptPanel = () => {
  const {
    transcript,
    isLoading,
    isFixing,
    transcriptError,
    handleFixTranscript,
  } = useTranscript();
  return (
    <VStack h="full" align="stretch">
      <TranscriptHeader
        isFixing={isFixing}
        handleFixTranscript={handleFixTranscript}
      />
      <TranscriptContent
        transcript={transcript}
        isLoading={isLoading}
        isFixing={isFixing}
        transcriptError={transcriptError}
      />
    </VStack>
  );
};
