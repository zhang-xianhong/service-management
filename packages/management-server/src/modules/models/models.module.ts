import { forwardRef, Logger, Module } from '@nestjs/common';
import { ModelsFieldsModel } from './models-fields.model';
import { ModelsInfoModel } from './models-info.model';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { DataTypesModel } from '../settings/settings-data-types.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServicesInfoModel } from '../services/service-info.model';
import { ModelsRelationModel } from './models-relation.model';
import { ServicesModule } from '../services/services.module';
import { ModelsFieldsHistoryModel } from './models-fields-history.model';
import { VersionControlModule } from '../version-control/version-control.module';
@Module({
  imports: [
    SequelizeModule.forFeature([
      ModelsInfoModel,
      ModelsFieldsModel,
      ModelsRelationModel,
      ModelsFieldsHistoryModel,
      DataTypesModel,
      ServicesInfoModel,
    ]),
    forwardRef(() => ServicesModule),
    forwardRef(() => VersionControlModule),
  ],
  controllers: [ModelsController],
  providers: [ModelsService, Logger],
  exports: [ModelsService],
})
export class ModelsModule {}
