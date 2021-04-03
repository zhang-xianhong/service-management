import { HttpModule, Logger, Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { TenantInfoModel } from './tenant-info.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { TenantContactModel } from './tenant-contact.model';
import { TenantManagerModel } from './tenant-manager.model';

@Module({
  imports: [SequelizeModule.forFeature([
    TenantInfoModel,
    TenantContactModel,
    TenantManagerModel,
  ]),
  HttpModule,
  ],
  controllers: [TenantController],
  providers: [TenantService, Logger],
  exports: [TenantService],
})
export class TenantModule { }
