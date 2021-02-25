import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { WinstonModule } from 'nest-winston';
import { RedisModule } from 'nestjs-redis';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';


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
    RedisModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('redis'),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
})

export class AppModule {}
