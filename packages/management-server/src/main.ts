import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import customConfig from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(helmet.hidePoweredBy());

  const config = customConfig();
  app.enableCors({
    origin: (origin, callback) => {
      callback(new Error(`cors error. origin:${origin} is illegal.`), origin.endsWith(config.CORS_DOMAIN || '.qq.com'));
    },
    allowedHeaders: ['content-type', 'X-MVS-CSRF-TOKEN'],
    methods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE',
    maxAge: 86400,
    credentials: true,
  });


  await app.listen(config.HTTP_PORT);
}
bootstrap();
