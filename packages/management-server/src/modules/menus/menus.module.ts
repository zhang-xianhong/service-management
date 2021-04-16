import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SettingsRolesModel } from '../settings/settings_roles.model';
import { MenuPermissionModel } from './menu-permission.model';
import { MenusController } from './menus.controller';
import { MenusModel } from './menus.model';
import { MenusService } from './menus.service';

@Module({
  imports: [SequelizeModule.forFeature([
    MenusModel,
    MenuPermissionModel,
    SettingsRolesModel,
  ])],
  controllers: [MenusController],
  providers: [MenusService, Logger],
  exports: [MenusService],
})
export class MenusModule { }
