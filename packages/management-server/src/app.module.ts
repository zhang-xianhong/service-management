import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { WinstonModule } from 'nest-winston';

import { UsersModule } from './modules/users/module';

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
    UsersModule,
  ],
})

export class AppModule {}
