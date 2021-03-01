import { Controller, Get, Param } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  /**
   * 获取指定服务信息
   * @param 服务id
   */
  @Get(':id')
  async findOneById(@Param() { id }) {
    const res = await this.servicesService.findById(Number(id));
    return res;
  }
}
