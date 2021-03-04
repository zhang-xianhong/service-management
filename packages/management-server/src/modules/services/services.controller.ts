import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QueryPipe, SearchQuery } from 'src/shared/pipes/query.pipe';
import { ApiException } from 'src/shared/utils/api.exception';
import { isEmpty } from 'src/shared/utils/validator';
import { ServicesService } from './services.service';
import { ServiceCodes } from 'src/shared/constants/code';
import { ILike } from 'typeorm';

@Controller('services')
export class ServicesController {
  constructor(private readonly service: ServicesService) {}

  // 获取服务列表
  @Get('')
  async serviceList(@Query(new QueryPipe) query: SearchQuery) {
    const where: any = {};
    if (query.classification) {
      where.classification = query.classification;
    }
    if (query.tags) {
      where.tags = query.tags;
    }
    if (query.keyword) {
      where.name = ILike(`%${query.keyword}%`);
    }
    const [list, total] = await this.service.findAll({
      ...query.conditions,
    }, where);
    return {
      total,
      list,
    };
  }

  // 获取服务详情
  @Get(':id')
  async findOneById(@Param() { id }) {
    return await this.service.findById(Number(id));
  }

  // 新增服务
  @Post()
  async create(@Body() postData) {
    const { name, apis } = postData;
    if (isEmpty(name)) {
      throw new ApiException({
        code: ServiceCodes.NAME_INVALID,
        message: '无效的服务名称',
      });
    }
    if (apis && Array.isArray(apis)) {
      const isInvalid = apis.some((service) => {
        if (isEmpty(service.name)) {
          return true;
        }
        return false;
      });
      if (isInvalid) {
        throw new ApiException({
          code: ServiceCodes.NAME_INVALID,
          message: '无效的接口名',
        });
      }
    }
    const service = await this.service.create(postData);
    // 调用java接口初始化服务工程
    const data = await this.service.initService(service.serviceId);
    console.log('data', data);
    return service;
  }

  @Post('/build')
  async buildService() {
    return 1;
  }

  /**
   * 更新服务
   * @param param0
   * @param body
   */
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
