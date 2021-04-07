import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QueryPipe, SearchQuery } from 'src/shared/pipes/query.pipe';
import { TenantInfoDto } from './dto/tenant-info.dto';
import { TenantUpdateInfoDto } from './dto/tenant-update-info.dto';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  // 获取租户列表
  @Get('')
  async tenantList(@Query(new QueryPipe) query: SearchQuery) {
    return await this.tenantService.findAll(query);
  }

  // 获取租户信息
  @Get(':id')
  async tenantInfo(@Param() { id }) {
    return await this.tenantService.findById(id);
  }

  // 新增租户
  @Post()
  async createTenant(@Body() body: TenantInfoDto) {
    return await this.tenantService.createTenant(body);
  }

  // 更新租户
  @Post(':id')
  async updateTenant(@Param() { id }, @Body() body: TenantUpdateInfoDto) {
    return await this.tenantService.updateTenant(id, body);
  }

  // 删除租户
  @Post('/delete/:id')
  async deleteTenant(@Param() { id }) {
    return await this.tenantService.deleteTenant(id);
  }

  // 冻结租户
  @Post('/freeze/:id')
  async freezeTenant(@Param() { id }) {
    return await this.tenantService.freezeTenant(id);
  }

  // 启用租户
  @Post('/enable/:id')
  async enableTenant(@Param() { id }) {
    return await this.tenantService.enableTenant(id);
  }

  // 获取租户下的部门树
  @Get('/department/tree')
  async getDepartmentTree(@Query() { deptId, level }) {
    const tenantId = 1;
    return await this.tenantService.getDepartmentTree(tenantId, deptId, level);
  }

  // 查询租户下的部门和用户
  @Get('/search/users')
  async searchDepartmentAndUser(@Query(new QueryPipe) query: SearchQuery) {
    const tenantId = 1;
    return await this.tenantService.searchDepartmentAndUser(tenantId, query);
  }
}
