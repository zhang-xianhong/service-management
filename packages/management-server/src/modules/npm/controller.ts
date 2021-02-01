import { Controller, Get, Query } from '@nestjs/common';
import { NpmService } from './service';
@Controller('npm')

export class NpmController {
  constructor(private readonly npmService: NpmService) {}
  @Get()
  async search(@Query() { keyword }) {
    return this.npmService.search(keyword);
  }
}
