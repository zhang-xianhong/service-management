import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommonCodes } from 'src/shared/constants/code';
import { QueryPipe, SearchQuery } from 'src/shared/pipes/query.pipe';
import { ApiException } from 'src/shared/utils/api.exception';
import { isEmpty } from 'src/shared/utils/validator';
import { ServicesService } from './services.service';
@Controller('services')
export class ServicesController {
  constructor(private readonly service: ServicesService) {}

  // 获取服务列表
  @Get('')
  async serviceList(@Query(new QueryPipe) query: SearchQuery) {
    const [list, total] = await this.service.findAll(query);
    return {
      total,
      list,
    };
  }

  // 获取服务详情
  @Get('/:id')
  async findOneById(@Param() { id }) {
    return await this.service.findById(Number(id));
  }

  // 新增服务
  @Post()
  async create(@Body() postData) {
    return await this.service.create(postData);
  }

  // 初始化服务
  @Get('/init/:id')
  async initService(@Param() { id }) {
    return await this.service.initService(id);
  }

  // 构建服务
  @Post('/build')
  async buildService(@Body() postData) {
    return await this.service.buildService(postData);
  }

  @Post('/update/status')
  async updateStatus(@Body() { id, status }) {
    if (!id || isEmpty(status)) {
      throw new ApiException({
        code: CommonCodes.PARAMETER_INVALID,
        message: 'id 和 status 字段不能为空',
      });
    }
    return await this.service.updateServiceStatus(id, status);
  }

  // 更新服务
  @Post('/:id')
  async update(@Param() { id }, @Body() body) {
    return await this.service.update(id, body);
  }
  // 删除接口
  @Post('/delete/:id')
  async deleteData(@Param() { id }) {
    return await this.service.delete(Number(id));
  }
}
