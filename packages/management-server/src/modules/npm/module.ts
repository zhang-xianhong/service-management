import { Module } from '@nestjs/common';
import { NpmController } from './controller';
import { NpmService } from './service';

@Module({
  imports: [],
  controllers: [NpmController],
  providers: [NpmService],
})
export class NpmModule {}
