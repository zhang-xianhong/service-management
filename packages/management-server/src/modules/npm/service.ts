import { Injectable } from '@nestjs/common';
import * as NpmSearch from 'libnpmsearch';

@Injectable()
export class NpmService {
  async search(keyword) {
    return await NpmSearch(keyword);
  }
}
