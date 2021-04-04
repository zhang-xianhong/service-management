import { HttpService, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CommonCodes } from 'src/shared/constants/code';
import { USER_BATCH_SEARCH_URL, FETCH_DEPARTMENT_TREE_URL } from 'src/shared/constants/url';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { ApiException } from 'src/shared/utils/api.exception';

interface UserInfo extends PlainObject {
  userName: string
  displayName?: string
  gender?: number
  phoneNumber?: string
  primaryEmail?: string
}

@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) { }

  /**
   * 批量查询用户信息
   * @param userIds
   * @returns
   */
  async fetchUsersByUserIds(userIds: number[]): Promise<UserInfo[]> {
    if (userIds.length === 0) {
      return [];
    }
    try {
      const { data }: any = await this.httpService.get(USER_BATCH_SEARCH_URL, {
        params: {
          userIds: userIds.join(','),
        },
      }).toPromise();
      if (data?.code === 0) {
        return data?.data;
      }
      throw data?.message;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.FETCH_FAIL,
        message: error?.message || '查询用户信息失败',
        error,
      }, HttpStatus.BAD_REQUEST);
    }
  }


  async fetchDepartmentTree(deptId: number, level: number) {
    try {
      const url = FETCH_DEPARTMENT_TREE_URL.replace(':deptId', String(deptId));
      const { data }: any = await this.httpService.get(url, {
        params: {
          level,
        },
      }).toPromise();
      if (data?.code === 0) {
        return data?.data;
      }
      throw data?.message;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.FETCH_FAIL,
        message: error?.message || '查询部门信息失败',
        error,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
