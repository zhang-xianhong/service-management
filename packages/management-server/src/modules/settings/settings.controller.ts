import {  Body, Controller, Get, Post  } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { isEmpty, isNumeric } from '../../shared/utils/validator';
import { ApiException } from '../../shared/utils/api.exception';
import { CommonCodes } from 'src/shared/constants/code';

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

  @Post('/data-types')
  async addDataTypes(@Body() { name, value, description, length }) {
    if (isEmpty(name) || isEmpty(value) || (!isEmpty(length) && !isNumeric(length))) {
      throw new ApiException({
        code: CommonCodes.PARAMETER_INVALID,
        message: '参数错误',
      });
    }
    const res = await this.service.createDataType({
      name,
      value,
      description,
      length,
    });
    return {
      dataTypeId: res.id,
    };
  }
}
