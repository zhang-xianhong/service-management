import { Logger, Module } from '@nestjs/common';
import { OwnersController } from './owners.controller';
import { OwnersService } from './owners.service';
import { OwnersModel } from './owners.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      OwnersModel,
    ]),
    UsersModule,
  ],
  controllers: [OwnersController],
  providers: [OwnersService, Logger],
  exports: [OwnersService],
})
export class OwnersModule { }
