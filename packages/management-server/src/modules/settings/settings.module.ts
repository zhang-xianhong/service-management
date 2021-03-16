
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsCategoriesModel } from './settings-categories.model';
import { DataTypesModel } from './settings-data-types.model';
import { SettingsTagsModel } from './settings-tags.model';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [SequelizeModule.forFeature([DataTypesModel, SettingsTagsModel, SettingsCategoriesModel])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
