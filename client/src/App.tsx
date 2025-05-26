import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { TranscriptPanel } from "./components/transcript/TranscriptPanel";
import { ChatPanel } from "./components/chat/ChatPanel";
import { ErrorBoundary } from "./components/error/ErrorBoundary";
import { ErrorBoundaryFallback } from "./components/error/ErrorBoundaryFallback";

function App() {
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);

  const errorFallback = (resetError: () => void) => (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h2" size="xl" color="red.500" mb={4}>
        Oops! Something went wrong.
      </Heading>
      <Text fontSize="lg" mb={4}>
        We're sorry, but an unexpected error occurred.
      </Text>
      <Button colorScheme="blue" onClick={resetError} size="lg">
        Try again
      </Button>
    </Box>
  );

  return (
    <ErrorBoundary
      fallback={
        <Box minH="100vh" bg="gray.50" py={8}>
          <Container maxW="4xl">
            {errorFallback(() => window.location.reload())}
          </Container>
        </Box>
      }
    >
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="8xl" h="calc(100vh - 64px)" px={4}>
          <VStack h="full" align="stretch">
            <Heading as="h1" size="xl" textAlign="center">
              Blueprint AI Work Simulation Exercise
            </Heading>
            <HStack
              align="stretch"
              h="full"
              bg="white"
              rounded="lg"
              overflow="hidden"
              borderWidth="1px"
              borderColor="gray.200"
              shadow="sm"
            >
              <Box flex="1" borderColor="gray.200" transition="all 0.2s">
                <ErrorBoundary
                  componentName="Transcript Panel"
                  fallback={({ error, resetError }) => (
                    <ErrorBoundaryFallback
                      error={error}
                      resetError={resetError}
                      componentName="Transcript Panel"
                    />
                  )}
                >
                  <TranscriptPanel />
                </ErrorBoundary>
              </Box>
              <Box
                position="relative"
                width={isChatCollapsed ? "40px" : "520px"}
                flexShrink={0}
                borderColor="gray.200"
                bg="white"
                transition="all 0.2s"
                overflow="hidden"
              >
                <ErrorBoundary
                  componentName="Chat Panel"
                  fallback={({ error, resetError }) => (
                    <ErrorBoundaryFallback
                      error={error}
                      resetError={resetError}
                      componentName="Chat Panel"
                    />
                  )}
                >
                  <ChatPanel
                    onToggleCollapse={() =>
                      setIsChatCollapsed(!isChatCollapsed)
                    }
                    isCollapsed={isChatCollapsed}
                  />
                </ErrorBoundary>
              </Box>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </ErrorBoundary>
  );
}

export default App;
