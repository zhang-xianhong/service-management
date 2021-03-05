import { Body, Controller, Get, Post, Query  } from '@nestjs/common';
import { CommonCodes } from 'src/shared/constants/code';
import { QueryPipe, SearchQuery } from 'src/shared/pipes/query.pipe';
import { ApiException } from 'src/shared/utils/api.exception';
import { isEmpty } from 'src/shared/utils/validator';
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

  // 标签
  @Get('/tags')
  async getTags(@Query(new QueryPipe()) query: SearchQuery) {
    const [list, total] = await this.service.findAllTags(query);
    return {
      list,
      total,
    };
  }

  /**
   * 获取未分页的标签列表
   */
  @Get('/tags/all')
  async getAllTags() {
    return await this.service.findAllTags({}, false);
  }

  /**
   * 新增标签
   * @param param0
   */
  @Post('/tags')
  async createTag(@Body() { name, description = '', cloneBy = '' }) {
    if (isEmpty(name)) {
      throw new ApiException({
        code: CommonCodes.PARAMETER_INVALID,
        message: '标签名不能为空',
      });
    }
    return await this.service.createTag({
      name,
      description,
      cloneBy,
    });
  }
}
