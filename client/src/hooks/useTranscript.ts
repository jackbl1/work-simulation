import { TRANSCRIPT_ERROR } from "@/utils/errors.constants";
import { useState, useCallback, useEffect } from "react";

export const useTranscript = () => {
  const [transcript, setTranscript] = useState<
    SharedTypes.TranscriptData | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching transcript:", error);
        setTranscriptError(TRANSCRIPT_ERROR);
        setTranscript({ transcript: "", chunkData: [] }); // Reset transcript on error
        setIsLoading(false);
      }
    };

    fetchTranscript();
  }, []);

  const handleFixTranscript = useCallback(async () => {
    try {
      setIsFixing(true);
      setTranscriptError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/fix-transcript`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
            `Failed to fix transcript: ${response.status}`
        );
      }

      const data = await response.json();
      setTranscript(data);
      return data;
    } catch (err) {
      console.error("Error fixing transcript:", err);
      setTranscriptError(
        err instanceof Error ? err.message : "Failed to fix transcript"
      );
      throw err;
    } finally {
      setIsFixing(false);
    }
  }, []);

  return {
    transcript,
    setTranscript,
    isLoading,
    isFixing,
    transcriptError,
    handleFixTranscript,
  };
};

export default useTranscript;
