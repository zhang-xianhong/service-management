import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { WinstonModule } from 'nest-winston';

import { UsersModule } from './modules/users/module';
import { NpmModule } from './modules/npm/module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './shared/guards/roles.guard';
@Module({
  imports: [
    ConfigModule.load(resolve(__dirname, 'config', '**/!(*.d|index).{ts,js}')),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('winston'),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    NpmModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})

export class AppModule {}
