import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiException } from 'src/shared/utils/api.exception';
import { isEmpty } from '../../shared/utils/validator';
import { ModelCodes } from '../../shared/constants/code';
import { ModelsService } from './models.service';
import { QueryPipe, SearchQuery } from '../../shared/pipes/query.pipe';
@Controller('models')

export class ModelsController {
  constructor(private readonly modelService: ModelsService) {}


  @Get()
  async findAll(@Query(new QueryPipe()) query: SearchQuery) {
    if (query.keyword) {
      // 处理 search
    }
    const [total, list] = await this.modelService.findAll({
      ...query.conditions,
    });
    return {
      total,
      list,
    };
  }


  /**
   * 获取model详情
   * @param param0
   */
  @Get(':id')
  async findOneById(@Param() { id }) {
    const res = await this.modelService.findById(Number(id));
    return res;
  }


  @Post()
  async create(@Body() postData) {
    const { name, fields } = postData;
    if (isEmpty(name)) {
      throw new ApiException({
        code: ModelCodes.NAME_INVALID,
        message: '无效的模型名称',
      });
    }
    if (fields && Array.isArray(fields)) {
      const isInvalid = fields.some((field) => {
        if (isEmpty(field.name)) {
          return true;
        }
        return false;
      });
      if (isInvalid) {
        throw new ApiException({
          code: ModelCodes.NAME_INVALID,
          message: '无效的字段名',
        });
      }
    }
    return await this.modelService.create(postData);
  }
}
