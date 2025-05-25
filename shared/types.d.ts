// Shared TypeScript type declarations

declare namespace SharedTypes {
  export interface TranscriptChunk {
    id: string;
    speaker: string;
    text: string;
  }

  export interface TranscriptData {
    /**
     * The actual transcript text content
     */
    transcript: string;

    /**
     * Array of transcript chunks
     */
    chunkData: TranscriptChunk[];
  }

  /**
   * Standard API response format
   */
  export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    error?: {
      code: string;
      message: string;
    };
  }
}
