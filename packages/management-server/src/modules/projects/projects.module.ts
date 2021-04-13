import {  Logger, Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectsModel } from './projects.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { SettingsModule } from '../settings/settings.module';
import { ProjectsRolesModel } from './projects-roles.model';
import { ProjectsMembersModel } from './projects-members.model';
import { UsersModule } from '../users/users.module';
import { FileModule } from '../files/files.module';
import { OwnersModule } from '../owners/owners.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProjectsModel,
      ProjectsRolesModel,
      ProjectsMembersModel,
    ]),
    SettingsModule,
    UsersModule,
    FileModule,
    OwnersModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, Logger],
  exports: [ProjectsService],
})
export class ProjectsModule {}
