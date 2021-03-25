import { Controller, Get, Query } from '@nestjs/common';
import { LogsService } from './logs.service';


@Controller('logs')
export class LogsController {
  constructor(private readonly service: LogsService) {}

  @Get('/runtime')
  async getRuntimeLog(@Query() { name, realtimeTs, keyword }) {
    return await this.service.getRuntimeLog(name, realtimeTs, keyword);
  }
}
