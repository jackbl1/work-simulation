// Shared TypeScript type declarations

declare namespace SharedTypes {
  export interface TranscriptChunk {
    id: number;
    speaker: string;
    text: string;
  }

  export interface TranscriptData {
    /**
     * The actual transcript text content
     */
    transcript: string;

    /**
     * Array of transcript raw text chunks, split by speaker
     */
    chunkData: TranscriptChunk[];
  }

  export interface ChatResponse {
    /**
     * The raw text response from the chat endpoint
     */
    response: string;

    /**
     * Array of citations
     */
    citations: string[];
  }
}
