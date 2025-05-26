import { Injectable } from '@nestjs/common';
import { db } from './db/db';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as diff from 'diff';
import OpenAI from 'openai';

type MessageRole = 'system' | 'user' | 'assistant' | 'function';

interface ChatMessage {
  role: MessageRole;
  content: string;
  name?: string;
}
@Injectable()
export class AppService {
  openai = new OpenAI({
    apiKey:
      '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',
  });

  getHello(): string {
    return 'Hello World!';
  }

  async getUsers(): Promise<string> {
    const users = await db.selectFrom('users').selectAll().execute();
    return JSON.stringify(users);
  }

  async fixTranscript(): Promise<{
    transcript: string;
    chunkData: { id: number; speaker: string; text: string }[];
    differences: diff.ChangeObject<string>[];
  }> {
    const transcriptPath = path.join(__dirname, '..', 'data', 'transcript.txt');
    let transcript = '';
    try {
      transcript = await fs.readFile(transcriptPath, 'utf-8');
    } catch {
      throw new Error('Failed to read transcript file');
    }

    // Fix the transcript, run another agent to determine if the speaker labels have worked as intended
    const fixedTranscript = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert at psychology and reading/interpreting therapy transcripts.
          The user will send you a transcript and your job is to fix the transcript so that each chunk is correctly labeled.
          Right now the chunks are labeled with [Speaker:0] or [Speaker:1], however some chunks are labeled incorrectly and some text that is currently inside a chunk needs to be split to a new chunk and labeled.
          Please output the transcript content exactly as it is, but with the correct speaker labels.
          `,
        },
        {
          role: 'user',
          content: transcript,
        },
      ],
    });

    if (!fixedTranscript.choices[0].message.content) {
      throw new Error('Failed to get response from OpenAI');
    }

    const fixedContent = fixedTranscript.choices[0].message.content;

    const differences = diff.diffLines(transcript, fixedContent);

    // let addedLines = 0;
    // let removedLines = 0;
    // const modifiedLines = [];

    // differences.forEach((part) => {
    //   const lines = part.value.split('\n').filter(Boolean);
    //   if (part.added) {
    //     addedLines += lines.length;
    //   } else if (part.removed) {
    //     removedLines += lines.length;
    //   } else if (lines.length > 0) {
    //     modifiedLines.push(lines);
    //   }
    // });

    // Split by either [Speaker: 0] or [Speaker: 1] while keeping the delimiter
    const chunks = fixedContent.split(/(?=\[Speaker:[01]\])/g);
    const chunkData = chunks
      .filter((chunk) => chunk.trim())
      .map((chunk, index) => {
        const speakerMatch = chunk.match(/^\[Speaker:([01])\]/);

        //TODO: maybe error handle better if no speaker is matched?
        const speaker = speakerMatch?.[1] ?? '0';
        const text = chunk.replace(/^\[Speaker:[01]\]\s*/, '');

        return {
          id: index,
          speaker,
          text: text.trim(),
        };
      });

    return {
      transcript: fixedContent,
      chunkData,
      differences,
    };
  }

  //async getTranscript(): Promise<SharedTypes.TranscriptData> {
  async getTranscript(): Promise<{
    transcript: string;
    chunkData: { id: number; speaker: string; text: string }[];
  }> {
    const transcriptPath = path.join(__dirname, '..', 'data', 'transcript.txt');
    let transcript = '';
    try {
      transcript = await fs.readFile(transcriptPath, 'utf-8');
    } catch {
      throw new Error('Failed to read transcript file');
    }

    // Split by either [Speaker: 0] or [Speaker: 1] while keeping the delimiter
    const chunks = transcript.split(/(?=\[Speaker:[01]\])/g);
    const chunkData = chunks
      .filter((chunk) => chunk.trim())
      .map((chunk, index) => {
        const speakerMatch = chunk.match(/^\[Speaker:([01])\]/);

        //TODO: maybe error handle better if no speaker is matched?
        const speaker = speakerMatch?.[1] ?? '0';
        const text = chunk.replace(/^\[Speaker:[01]\]\s*/, '');

        return {
          id: index,
          speaker,
          text: text.trim(),
        };
      });

    return {
      transcript,
      chunkData,
    };
  }

  async chat(
    query: string,
    history: { role: string; content: string }[],
    transcript: { id: number; speaker: string; text: string }[],
  ): Promise<{ response: string; citations: string[] }> {
    const systemMessage: ChatMessage = {
      role: 'system' as const,
      content: `You are an expert at psychology and reading/interpreting therapy transcripts. 
    Here is a transcript of a conversation between a patient and a therapist. 
    Answer the patient's question based on the transcript, and output citations at the bottom 
    of your response citing the chunks of the transcript that you used to answer the question. 
    Make sure your citations follow the format [chunk-1, chunk-2] and use the chunk id defined in the transcript data.
    Output the citations at the very end of the response. Do not include any additional text or punctuation after the citations.
    
    Example output:
    
    Here is my response to the patient's question.
    
    [chunk-1, chunk-2]

    Transcript:
    ${JSON.stringify(transcript, null, 2)}`,
    };

    const userMessage: ChatMessage = {
      role: 'user' as const,
      content: query,
    };

    const chatHistory: ChatMessage[] = history.map((msg) => ({
      role: msg.role as MessageRole,
      content: msg.content,
    }));

    const messages: any = [systemMessage, ...chatHistory, userMessage];

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const responseContent = response.choices[0].message.content;

      if (!responseContent) {
        throw new Error('Empty response from OpenAI');
      }

      console.log(
        'Chat completion finished - response content:',
        responseContent,
      );

      const citationsMatch = responseContent.match(
        /\[(chunk-\d+(?:,\s*chunk-\d+)*)\](?=[^[]*$)/,
      );
      const citations = citationsMatch
        ? citationsMatch[1]
            .split(/,\s*/)
            .map((c) => c.trim().replace('chunk-', ''))
        : [];

      const cleanedResponse = responseContent
        .replace(/\s*\[chunk-\d+(?:,\s*chunk-\d+)*\](?=[^[]*$)/, '')
        .trim();

      return {
        response: cleanedResponse,
        citations,
      };
    } catch (error) {
      console.error('Error in chat completion:', error);
      throw new Error(`Failed to get response from OpenAI: ${error.message}`);
    }
  }
}
