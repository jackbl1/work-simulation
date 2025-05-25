import { useEffect, useState } from "react";
import { Box, Container, Heading, HStack, VStack } from "@chakra-ui/react";
import { TranscriptPanel } from "./components/transcript/TranscriptPanel";
import { ChatPanel } from "./components/chat/ChatPanel";

function App() {
  const [transcript, setTranscript] = useState<string>("");

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/transcript`
        );
        const data: SharedTypes.TranscriptData = await response.json();

        if (data) {
          setTranscript(data.transcript);
        }
      } catch (error) {
        console.error("Error fetching transcript:", error);
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
            <Box flex="1" borderRightWidth="1px" borderColor="gray.200">
              <TranscriptPanel transcript={transcript} />
            </Box>
            <Box flex="1">
              <ChatPanel />
            </Box>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
