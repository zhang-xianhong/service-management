export const isProduction = true || process.env.NODE_ENV === 'production';

const useMock = Number(process.env.VUE_APP_USE_MOCK) === 1;
export const getUrl = (urls: string[], params = ''): string => {
  const [api, mock] = urls;
  if (mock && useMock) {
    return mock.replace('_', params);
  }
  return api.replace('_', params);
};
