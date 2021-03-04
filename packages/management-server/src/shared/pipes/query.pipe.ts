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
  skip: number
  take: number
  order: undefined | {
    [fieldName: string]: string
  },
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
    const { sortField, keyword } = value;
    page = parseInt(page, 10);
    pageSize = parseInt(pageSize, 10);
    page = (isNaN(page) || page < 1) ? 1 : page;
    pageSize = (isNaN(pageSize) || pageSize < 1) ? DEFAULT_PAGE_SIZE : pageSize;
    // sortType = ['ascending', 'descending'].includes(sortType) ? sortType : 'descending';
    // sortType = sortType === 'descending' ? 'DESC' : 'ASC';
    sortType = sortType === 'ascending' ? SortType.ASC : SortType.DESC;
    query.keyword = keyword ? keyword.trim() : '';
    // conditions可直接参与数据库查询
    query.conditions = {
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: !sortField ? undefined : {
        [sortField]: sortType,
      },
    };
    return query;
  }
}
