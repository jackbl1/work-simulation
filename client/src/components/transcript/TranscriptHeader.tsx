import { Button, Flex, Heading } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";

interface TranscriptHeaderProps {
  isFixing: boolean;
  handleFixTranscript: () => void;
}

export const TranscriptHeader = ({
  isFixing,
  handleFixTranscript,
}: TranscriptHeaderProps) => {
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
      <Heading size="sm" color="gray.700" flex="1">
        Transcript
      </Heading>

      <Tooltip
        content="This transcript appears to have some lines misattributed to the wrong speaker. Click here to fix with our AI agent."
        showArrow
      >
        <Button
          colorScheme="blue"
          size="sm"
          onClick={handleFixTranscript}
          variant="outline"
          disabled={isFixing}
          loading={isFixing}
          loadingText="Fixing..."
          minW="110px"
        >
          Fix Transcript
        </Button>
      </Tooltip>
    </Flex>
  );
};
