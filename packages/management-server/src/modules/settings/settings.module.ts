
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsCategoriesEntity } from './settings-categories.entity';
import { DataTypesEntity } from './settings-data-types.entity';
import { SettingsTagsEntity } from './settings-tags.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [SequelizeModule.forFeature([DataTypesEntity, SettingsTagsEntity, SettingsCategoriesEntity])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
