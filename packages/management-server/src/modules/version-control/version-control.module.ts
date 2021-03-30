import { HttpModule, Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VersionControlModel } from './version-control.model';
import {  VersionControlController } from './version-control.controller';
import {  VersionControlService } from './version-control.service';


@Module({
  imports: [SequelizeModule.forFeature([
    VersionControlModel,
  ]),
  HttpModule,
  ],
  controllers: [VersionControlController],
  providers: [VersionControlService, Logger],
  exports: [VersionControlService],
})
export class VersionControlModule {}
