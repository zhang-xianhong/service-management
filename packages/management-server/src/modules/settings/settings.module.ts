
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SettingsCategoriesModel } from './settings-categories.model';
import { DataTypesModel } from './settings-data-types.model';
import { SettingsDictionaryTypeModel } from './settings-dictionary-type.model';
import { SettingsDictionaryModel } from './settings-dictionary.model';
import { SettingsRegionModel } from './settings-region.model';
import { SettingsTagsModel } from './settings-tags.model';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [SequelizeModule.forFeature([
    DataTypesModel,
    SettingsTagsModel,
    SettingsCategoriesModel,
    SettingsDictionaryTypeModel,
    SettingsDictionaryModel,
    SettingsRegionModel,
  ])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule { }
