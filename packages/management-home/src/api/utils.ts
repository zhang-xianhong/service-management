export const isProduction = false || process.env.NODE_ENV === 'production';

export const getUrl = (urls: string[], params = ''): string => {
  if (isProduction) {
    return urls[0];
  }
  return urls[1] || urls[0].replace('_', params);
};
