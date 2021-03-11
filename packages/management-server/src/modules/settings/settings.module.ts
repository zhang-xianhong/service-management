
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsCategoryEntity } from './settings-category.entity';
import { DataTypesEntity } from './settings-data-types.entity';
import { SettingsTagsEntity } from './settings-tags.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([DataTypesEntity, SettingsTagsEntity, SettingsCategoryEntity])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
