/**
 * 处理Query参数
 * 主要处理分页，排序相关的参数
 */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { DEFAULT_PAGE_SIZE } from '../constants';
import { SortType } from '../constants/sort-type';

export interface PlainObject {
  [propName: string]: any
}
export interface SearchConditions extends PlainObject{
  offset: number
  limit: number
  order: undefined | [
    [fieldName: string, sortType:SortType]
  ],
}

export interface SearchQuery extends PlainObject {
  conditions: SearchConditions
}

@Injectable()
export class QueryPipe implements PipeTransform <any, SearchQuery> {
  transform(value: any, { type }: ArgumentMetadata): SearchQuery {
    if (!value || type !== 'query') {
      return value;
    }
    const query: SearchQuery = { ...value };
    let { page, pageSize, sortType } = value;
    const { sortField = 'updateTime', keyword } = value;
    page = parseInt(page, 10);
    pageSize = parseInt(pageSize, 10);
    page = (isNaN(page) || page < 1) ? 1 : page;
    pageSize = (isNaN(pageSize) || pageSize < 1) ? DEFAULT_PAGE_SIZE : pageSize;
    sortType = sortType === 'ascending' ? SortType.ASC : SortType.DESC;
    query.keyword = keyword ? keyword.trim() : '';
    // conditions可直接参与数据库查询
    query.conditions = {
      attributes: { exclude: ['isDelete'] },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [
        [sortField, sortType],
      ],
    };
    return query;
  }
}
