import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {

  }

  getHello(): string {
    const port = this.config.get('HTTP_PORT');
    return port;
  }
}
