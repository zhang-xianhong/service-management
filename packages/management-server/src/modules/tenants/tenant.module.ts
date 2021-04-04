import { HttpModule, Logger, Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { TenantInfoModel } from './tenant-info.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { TenantContactModel } from './tenant-contact.model';
import { TenantManagerModel } from './tenant-manager.model';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([
    TenantInfoModel,
    TenantContactModel,
    TenantManagerModel,
  ]),
  HttpModule,
  UsersModule,
  ],
  controllers: [TenantController],
  providers: [TenantService, Logger],
  exports: [TenantService],
})
export class TenantModule { }
