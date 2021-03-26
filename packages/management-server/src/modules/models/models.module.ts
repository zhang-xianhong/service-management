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
@Module({
  imports: [
    SequelizeModule.forFeature([
      ModelsInfoModel,
      ModelsFieldsModel,
      ModelsRelationModel,
      DataTypesModel,
      ServicesInfoModel,
    ]),
    forwardRef(() => ServicesModule),
  ],
  controllers: [ModelsController],
  providers: [ModelsService, Logger],
  exports: [ModelsService],
})
export class ModelsModule {}
