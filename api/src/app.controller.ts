import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

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
  async getTranscript(): Promise<{
    transcript: string;
    chunkData: {
      id: string;
      speaker: string;
      text: string;
    }[];
  }> {
    return this.appService.getTranscript();
  }
}
