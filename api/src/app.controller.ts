import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import * as diff from 'diff';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  async getUsers(): Promise<string> {
    return this.appService.getUsers();
  }

  @Post('fix-transcript')
  async fixTranscript(): Promise<{
    transcript: string;
    chunkData: { id: number; speaker: string; text: string }[];
    differences: diff.ChangeObject<string>[];
  }> {
    return this.appService.fixTranscript();
  }

  @Get('transcript')
  //async getTranscript(): Promise<SharedTypes.TranscriptData> {
  async getTranscript(): Promise<{
    transcript: string;
    chunkData: { id: number; speaker: string; text: string }[];
  }> {
    return this.appService.getTranscript();
  }

  @Post('chat')
  async chat(
    @Body()
    body: {
      query: string;
      history: { role: string; content: string }[];
      transcript: { id: number; speaker: string; text: string }[];
    },
  ): Promise<{ response: string; citations: string[] }> {
    const { query, history, transcript } = body;
    return this.appService.chat(query, history, transcript);
  }
}
