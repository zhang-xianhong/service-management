/* eslint-disable no-param-reassign */
import { getServiceList, deleteService } from '@/api/servers';
import { getAllTags } from '@/api/settings/tags';
import { reactive, ref } from 'vue';
import { getClassificationList } from '@/api/settings/classification';
import { statusMap } from '@/views/service-management/business-service/utils/service-status-map';

export const serviceTableList = reactive({
  list: [],
  total: 10,
} as any);
export const allService = ref([] as any);

export const serviceDetail = reactive({} as any);

export const persons = ref([] as any);
export const sorts = ref([] as any);
export const tags = ref([] as any);
export const tagMap = ref({} as any);
export const sortMap = ref({} as any);
export const ownersMap = ref({} as any);

export function refreshServiceList(payload = {} as any) {
  let data = {} as any;
  if (payload) {
    data = { ...payload };
    data.tags = payload.tags ? payload.tags.join(',') : '';
  }
  Object.keys(data).forEach((x) => {
    if (!data[x]) {
      delete data[x];
    }
  });
  return getServiceList(data).then((res) => {
    ownersMap.value = {};
    res.data.ownerUsers.forEach((x: any) => {
      ownersMap.value[x.id] = x;
    });
    if (res.data.rows) {
      res.data.rows.forEach((x: any) => {
        x.name = x.name.replace(/^srv-/g, '');
        const arr = x.classification.split(',');
        x.classification = arr
          .map((x: any) => sortMap.value[x])
          .filter((x: any) => x)
          .join(',');
        const tagarr = x.tag.split(',');
        x.tag = tagarr
          .map((x: any) => tagMap.value[x])
          .filter((x: any) => x)
          .join(',');
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        x.statusStr = statusMap[x.status];
        x.ownerstr = x.owners
          .map((x: any) => ownersMap.value[x.userId].displayName)
          .filter((x: any) => x)
          .join(',');
      });
    }
    serviceTableList.list = res.data.rows;
    serviceTableList.total = res.data.count;
  });
}

export const getTagsForService = () =>
  getAllTags().then((res) => {
    tags.value = res.data;
    const arr = {} as any;
    res.data.forEach((x: any) => {
      arr[x.id] = x.name;
    });
    tagMap.value = arr;
  });

export function deleteBlankArray(item: any) {
  if (item.children && item.children.length > 0) {
    item.children.forEach((x: any) => {
      deleteBlankArray(x);
    });
  } else {
    // eslint-disable-next-line no-param-reassign
    item.children = '';
    // eslint-disable-next-line no-param-reassign
    delete item.children;
  }
  sortMap.value[item.id] = item.name;
}

export const getClassifications = () => {
  sortMap.value = {};
  return getClassificationList().then((res) => {
    const ids = { children: res.data };
    deleteBlankArray(ids);
    sorts.value = ids.children;
    console.log(sorts.value, sortMap.value);
  });
};

export const deleteServiceForList = (arr: Array<any>) =>
  deleteService(arr as any).then((res) => {
    console.log(res);
  });

export function getAllService() {
  return getServiceList({ all: true }).then((res) => {
    if (res.data && res.data.rows) {
      res.data.rows.forEach((x: any) => {
        // eslint-disable-next-line no-param-reassign
        x.name = x.name.replace(/^srv-/g, '');
      });
      allService.value = res.data.rows;
    } else {
      allService.value = [];
    }
  });
}
