import { Injectable } from '@nestjs/common';
import { db } from './db/db';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import OpenAI from 'openai';

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

  async fixTranscript(): Promise<string> {
    const transcriptPath = path.join(__dirname, '..', 'data', 'transcript.txt');
    let transcript = '';
    try {
      transcript = await fs.readFile(transcriptPath, 'utf-8');
    } catch {
      throw new Error('Failed to read transcript file');
    }

    // Fix the transcript, run another agent to determine if the speaker labels have worked as intended
    const fixedTranscript = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
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

    // Write a new transcript file path with '-fixed' suffix
    const parsedPath = path.parse(transcriptPath);
    const fixedTranscriptPath = path.join(
      parsedPath.dir,
      `${parsedPath.name}-fixed${parsedPath.ext}`,
    );
    await fs.writeFile(fixedTranscriptPath, fixedContent);

    return `Fixed transcript saved to: ${fixedTranscriptPath}`;
  }

  async getTranscript(): Promise<SharedTypes.TranscriptData> {
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
          id: `chunk-${index}`,
          speaker,
          text: text.trim(),
        };
      });

    return {
      transcript,
      chunkData,
    };
  }

  async submitTranscriptQuery(query: string): Promise<string> {
    const transcriptPath = path.join(__dirname, '..', 'data', 'transcript.txt');
    let transcript = '';
    try {
      transcript = await fs.readFile(transcriptPath, 'utf-8');
    } catch {
      throw new Error('Failed to read transcript file');
    }

    // TODO: stream this with SSE
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert at psychology and reading/interpreting therapy transcripts. Here is a transcript of a conversation between a patient and a therapist. Answer the patient's question based on the transcript.

Transcript:
${transcript}`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
    });

    if (!response.choices[0].message.content) {
      throw new Error('Failed to get response from OpenAI');
    }

    return response.choices[0].message.content;
  }
}
