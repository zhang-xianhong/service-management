import { HttpService, Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { CommonCodes } from 'src/shared/constants/code';
import { LOG_SERVICE_URL } from 'src/shared/constants/url';
import { ApiException } from 'src/shared/utils/api.exception';


@Injectable()
export class LogsService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private httpService: HttpService,
    private sequelize: Sequelize,
  ) {}

  async getRuntimeLog(name: string, realtimeTs?: number, keyword?: string) {
    try {
      const { data }: any = await this.httpService.get(`${LOG_SERVICE_URL}`, {
        params: {
          name,
          realtimeTs,
          searchWords: keyword,
          logConfigName: 'log4j2',
        },
      }).toPromise();
      if (data.error) {
        throw data.error;
      }
      return data.result;
    } catch (error) {
      throw new ApiException({
        code: CommonCodes.FETCH_FAIL,
        message: '获取日志失败',
        error,
      });
    }
  }
}
