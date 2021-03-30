import { Controller } from '@nestjs/common';
import { VersionControlService } from './version-control.service';
@Controller('version-control')
export class VersionControlController {
  constructor(private readonly service: VersionControlService) {}
}
