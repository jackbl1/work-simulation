import { useEffect, useState } from "react";
import { Box, Container, Heading, HStack, VStack } from "@chakra-ui/react";
import { TranscriptPanel } from "./components/transcript/TranscriptPanel";
import { ChatPanel } from "./components/chat/ChatPanel";
import { TRANSCRIPT_ERROR } from "./utils/errors.constants";

function App() {
  const [transcript, setTranscript] = useState<SharedTypes.TranscriptData>({
    transcript: "",
    chunkData: [],
  });
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/transcript`
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }

        const data: SharedTypes.TranscriptData = await response.json();

        setTranscript(data);
        setTranscriptError(null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transcript:", error);
        setTranscriptError(TRANSCRIPT_ERROR);
        setTranscript({ transcript: "", chunkData: [] }); // Reset transcript on error
        setLoading(false);
      }
    };

    fetchTranscript();
  }, []);

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="8xl" h="calc(100vh - 64px)" px={4}>
        <VStack h="full" spacing={6} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            Blueprint AI Work Simulation Exercise
          </Heading>
          <HStack
            align="stretch"
            spacing={0}
            h="full"
            bg="white"
            rounded="lg"
            overflow="hidden"
            borderWidth="1px"
            borderColor="gray.200"
            shadow="sm"
          >
            <Box flex="1" borderColor="gray.200" transition="all 0.2s">
              <TranscriptPanel
                transcript={transcript}
                setTranscript={setTranscript}
                loading={loading}
                error={transcriptError}
              />
            </Box>
            <Box
              position="relative"
              width={isChatCollapsed ? "40px" : "400px"}
              flexShrink={0}
              borderColor="gray.200"
              bg="white"
              transition="all 0.2s"
              overflow="hidden"
            >
              <ChatPanel
                transcript={transcript}
                onToggleCollapse={() => setIsChatCollapsed(!isChatCollapsed)}
                isCollapsed={isChatCollapsed}
              />
            </Box>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
