import { getDictionaryTypes, getDictionaryDetail } from '@/api/settings/dictionary';
import { getRegions } from '@/api/settings/region';

const types: any[] = [];

export default async () => {
  await getDictionaryTypes().then((res: any) => {
    types.push(...res.data);
  });
  // 获取行业信息
  const industryId: string = types[0].typeKey;
  const {
    data: { dictionaries: industryOptions },
  } = await getDictionaryDetail(industryId);

  // 获取企业性质信息
  const natureId: string = types[1].typeKey;
  const {
    data: { dictionaries: natureOptions },
  } = await getDictionaryDetail(natureId);

  // 获取企业规模信息
  const scaleId: string = types[2].typeKey;
  const {
    data: { dictionaries: scaleOptions },
  } = await getDictionaryDetail(scaleId);

  // 获取省份信息
  const { data: provinceOptions } = await getRegions({ params: { level: 1 } });

  return {
    industryOptions,
    natureOptions,
    scaleOptions,
    provinceOptions,
  };
};
