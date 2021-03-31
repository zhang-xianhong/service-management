import { buildService } from '@/api/servers';
import { ref } from 'vue';

export const currentServiceIdForData = ref('' as any);
export const buildServiceData = (branch = 'develop', userId = '123456') =>
  buildService({ serviceId: currentServiceIdForData.value, branch, userId });
