import {  Controller, Get, Post  } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly modelService: SettingsService) {}
  @Get('/columns/:module')
  async getColumns() {}

  @Post('/columns/:module')
  async setColumns() {}
}
