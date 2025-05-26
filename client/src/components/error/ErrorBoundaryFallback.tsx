import { Button, Box, Text, Heading } from "@chakra-ui/react";

interface ErrorBoundaryFallbackProps {
  error: Error | null;
  resetError: () => void;
  componentName: string;
}

export const ErrorBoundaryFallback = ({
  error,
  resetError,
  componentName,
}: ErrorBoundaryFallbackProps) => (
  <Box
    p={4}
    borderWidth="1px"
    borderRadius="md"
    borderColor="red.200"
    bg="red.50"
    height="100%"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    textAlign="center"
  >
    <Heading as="h3" size="md" color="red.500" mb={2}>
      Error in {componentName}
    </Heading>
    <Text color="gray.600" mb={4}>
      {error?.message || "An unexpected error occurred"}
    </Text>
    <Button
      colorScheme="red"
      variant="outline"
      size="sm"
      onClick={resetError}
      alignSelf="center"
    >
      Retry
    </Button>
  </Box>
);
