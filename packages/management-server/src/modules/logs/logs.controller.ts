import { Controller, Get, Query } from '@nestjs/common';
import { LOG_NAME } from '../services/config';
import { LogsService } from './logs.service';


@Controller('logs')
export class LogsController {
  constructor(private readonly service: LogsService) {}

  @Get('/runtime')
  async getRuntimeLog(@Query() { name = LOG_NAME.CI_CD, realtimeTs, keyword }) {
    return await this.service.getRuntimeLog(name, realtimeTs, keyword);
  }
}
