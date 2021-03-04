import { Controller, Get, Post  } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}
  @Get('/columns/:module')
  async getColumns() {}

  @Post('/columns/:module')
  async setColumns() {}

  @Get('/dictionaries')
  async getDictionaries() {}

  @Get('/dictionaries/:parent')
  async getDictionariesByPCode() {}

  @Get('/data-types')
  async getDataTypes() {
    return await this.service.findDataTypes();
  }
}
