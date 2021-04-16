import { Body, Controller, Get, Param, Post  } from '@nestjs/common';
import { ParamIdDto } from '../base.dto';
import { MenuDto } from './dto/menu.dto';
import { MenusService } from './menus.service';

@Controller('menus')
export class MenusController {
  constructor(private readonly service: MenusService) {}

  // 菜单

  // 新增菜单权限
  @Post('/permission')
  async createMenuPermission(@Body() body) {
    return await this.service.createMenuPermission(body);
  }
  // 查询菜单树
  @Get('/tree')
  async getMenusTree() {
    return await this.service.findMenusTree();
  }
  // 更新菜单
  @Post('/:id')
  async updateMenu(@Param(){ id }: ParamIdDto, @Body() body) {
    return await this.service.updateMenu(id, body);
  }

  // 删除菜单
  @Post('/delete/:id')
  async deleteMenu(@Param(){ id }: ParamIdDto) {
    return await this.service.deleteMenu(id);
  }
  // 新增菜单
  @Post()
  async createMenu(@Body() body: MenuDto) {
    return await this.service.createMenu(body);
  }

  // 查询角色菜单树
  @Get('/role/:id')
  async getRoleMenus(@Param(){ id }) {
    return await this.service.getRoleMenus(id);
  }
}
