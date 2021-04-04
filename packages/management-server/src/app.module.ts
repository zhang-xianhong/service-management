import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { WinstonModule } from 'nest-winston';
import { RedisModule } from 'nestjs-redis';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ModelsModule } from './modules/models/models.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ServicesModule } from './modules/services/services.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { LogsModule } from './modules/logs/logs.module';
import { TenantModule } from './modules/tenants/tenant.module';
import { VersionControlModule } from './modules/version-control/version-control.module';
import { FileModule } from './modules/files/files.module';

@Module({
  imports: [
    ConfigModule.load(resolve(__dirname, 'config', '**/!(*.d|index).{ts,js}')),
    SequelizeModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('winston'),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('redis'),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ModelsModule,
    SettingsModule,
    ServicesModule,
    ProjectsModule,
    ServicesModule,
    VersionControlModule,
    LogsModule,
    TenantModule,
    FileModule,
  ],
})

export class AppModule {}
