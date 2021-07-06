/* eslint-disable no-param-reassign */
import { getServiceList, deleteService, getServiceDependencyList } from '@/api/servers';
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
    if (Object.prototype.toString.call(payload.tags) === '[object String]') {
      data.tags = payload.tags;
    } else if (Object.prototype.toString.call(payload.tags) === '[object Array]') {
      data.tags = payload.tags.join(',');
    } else {
      data.tags = '';
    }
  }
  Object.keys(data).forEach((x) => {
    if (!data[x]) {
      delete data[x];
    }
  });
  return getServiceList(data).then((res) => {
    ownersMap.value = {};
    if (res.data.ownerUsers) {
      res.data.ownerUsers.forEach((x: any) => {
        ownersMap.value[x.id] = x;
      });
    }
    if (res.data.rows) {
      res.data.rows.forEach((x: any) => {
        x.name = x.name ? x.name.replace(/^srv-/g, '') : 'service name not found';
        const arr = x.classification ? x.classification.split(',') : [];
        x.classification = arr
          .map((x: any) => sortMap.value[x])
          .filter((x: any) => x)
          .join(',');
        const tagarr = x.tag ? x.tag.split(',') : [];
        x.tag = tagarr
          .map((x: any) => tagMap.value[x])
          .filter((x: any) => x)
          .join(',');
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        x.statusStr = statusMap[x.status];
        if (x.owners) {
          const sortable = x.owners.sort((a: any, b: any) => a.userId - b.userId);
          x.ownerstr = sortable
            .map((x: any) => ownersMap.value[x.userId]?.displayName)
            .filter((x: any) => x)
            .join(',');
        }
        x.source = x.source || '新建';
      });
    }
    serviceTableList.list = res.data.rows;
    serviceTableList.total = res.data.count;
  });
}

export const getTagsForService = async () =>
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

export const getClassifications = async () => {
  sortMap.value = {};
  return getClassificationList().then((res) => {
    const ids = { children: res.data };
    deleteBlankArray(ids);
    sorts.value = ids.children;
  });
};

export const deleteServiceForList = (arr: Array<any>) =>
  deleteService(arr as any).then((res) => {
    console.log(res);
  });

export function getAllService() {
  console.log('get service dependency');
  return getServiceDependencyList({}).then((res) => {
    if (res?.data) {
      const { data = [] } = res;
      const serviceList = data.map((i: any) => ({
        label: i.serviceName,
        value: i.serviceName,
        children: i.versions?.map((v: any) => ({
          value: v.version,
          label: v.preparing ? `${v.version}(服务构建中)` : v.version,
          versionType: v.versionType,
          disabled: v.preparing,
        })),
      }));
      allService.value = serviceList;
    } else {
      allService.value = [];
    }
  });
}
export function getServiceVersionType(name: string, version: string) {
  const { children: serversVersion = [] } = allService.value.find((service: any) => service.value === name);
  const versionData = serversVersion.find((v: any) => v.value === version) || {};
  return versionData.versionType;
}
