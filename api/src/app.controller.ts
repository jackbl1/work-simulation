import { Controller, Get, Post } from '@nestjs/common';
import type { AppService } from './app.service';

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
  async fixTranscript(): Promise<string> {
    return this.appService.fixTranscript();
  }

  @Get('transcript')
  async getTranscript(): Promise<SharedTypes.TranscriptData> {
    return this.appService.getTranscript();
  }
}
