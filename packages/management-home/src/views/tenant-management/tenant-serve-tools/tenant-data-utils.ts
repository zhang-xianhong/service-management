import { getTenantList } from '@/api/tenant';

export function getTenantListForTable() {
  return getTenantList().then((res) => res);
}
