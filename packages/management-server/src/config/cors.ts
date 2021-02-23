import getConfig from './';

const config = getConfig();

export default {
  origin: (origin, callback) => {
    const allow = !origin || origin.endsWith(config.CORS_DOMAIN || '.qq.com');
    callback(allow ? null : new Error(`cors error. origin:${origin} is illegal.`), allow);
  },
  allowedHeaders: ['content-type', 'X-MVS-CSRF-TOKEN'],
  methods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE',
  maxAge: 86400,
  credentials: true,
};
