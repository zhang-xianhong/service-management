import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommonCodes } from 'src/shared/constants/code';
import { QueryPipe, SearchQuery } from 'src/shared/pipes/query.pipe';
import { ApiException } from 'src/shared/utils/api.exception';
import { isEmpty } from 'src/shared/utils/validator';
import { DeletedIdsDto, NameUsableDto, ParamIdDto } from '../base.dto';
import { ServiceIdDto, ServiceStartDto } from './dto/service-actions.dto';
import { ServiceApisDto } from './dto/service-apis.dto';
import { ServiceConfigDto } from './dto/service-config.dto';
import { ServiceInfoDto } from './dto/service-info.dto';
import { ServicesService } from './services.service';
@Controller('services')
export class ServicesController {
  constructor(private readonly service: ServicesService) {}

  // 获取服务列表
  @Get('')
  async serviceList(@Query(new QueryPipe) query: SearchQuery) {
    return await this.service.findAll(query);
  }

  // 服务配置
  @Post('/config')
  async serviceConfig(@Body() body: ServiceConfigDto) {
    return await this.service.addServiceConfig(body);
  }

  // 获取服务模型详情
  @Get('/models')
  async findModelsByServiceId(@Query() { serviceId }) {
    return await this.service.getModelsByServiceId(Number(serviceId));
  }

  // 获取服务接口详情
  @Get('/apis')
  async findApisByServiceId(@Query() { serviceId }) {
    return await this.service.getApisByServiceId(Number(serviceId));
  }

  // 获取服务详情
  @Get('/:id')
  async findOneById(@Param() { id }: ParamIdDto) {
    return await this.service.findById(Number(id));
  }

  // 删除服务接口
  @Post('/delete')
  async deleteData(@Body() { ids }: DeletedIdsDto) {
    return await this.service.deleteServices(ids);
  }

  // 校验名称是否可用
  @Post('name/usable')
  async checkServiceNameUsable(@Body() { name, id }: NameUsableDto) {
    return await this.service.checkServiceNameUsable(name, id);
  }

  // 新增服务
  @Post()
  async create(@Body() postData: ServiceInfoDto) {
    return await this.service.createService(postData);
  }

  // 新增/更新服务接口
  @Post('/:id/apis')
  async createApi(@Param() { id }: ParamIdDto, @Body() body: ServiceApisDto) {
    return await this.service.addServiceApis(id, body);
  }

  // 启动服务
  @Post('/start')
  async buildService(@Body() postData: ServiceStartDto) {
    return await this.service.startService(postData);
  }

  // 停止服务
  @Post('/stop')
  async stopService(@Body() { serviceId }: ServiceIdDto) {
    return await this.service.stopService(serviceId);
  }

  /**
   * 获取服务变更记录
   * @param param0
   * @returns
   */
  @Get('/:id/changes')
  async getServiceChanges(@Param() { id }) {
    return await this.service.getServiceModelChanges(id);
  }

  /**
   * 应用变更
   * @param param0
   */
  @Post('/changes/apply')
  async applyChanges(@Body() { serviceId }: ServiceIdDto) {
    return await this.service.applyChanges(serviceId);
  }

  /**
   * 更新服务状态
   * @param param0
   * @returns
   */
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
  async update(@Param() { id }: ParamIdDto, @Body() body) {
    return await this.service.updateService(id, body);
  }
}
