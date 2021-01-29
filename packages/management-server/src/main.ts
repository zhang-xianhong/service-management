import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import customConfig from './config';
import corsConfig from './config/cors';
import { AllExceptionsFilter } from './shared/filters/exceptions';
import { TraceMiddleware } from './shared/middleware/trace';
import { ResponseInterceptor } from './shared/interceptors/response';
import { AuthGuard } from './shared/guards/auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  });

  const config = customConfig();
  app.use(helmet());
  app.use(helmet.hidePoweredBy());
  // 应用全局中间件
  app.use(TraceMiddleware);
  // cors
  app.enableCors(corsConfig);

  const nestWinston = app.get(WINSTON_MODULE_NEST_PROVIDER);

  // 全局过滤器
  app.useGlobalFilters(new AllExceptionsFilter(nestWinston.logger));
  // 全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 全局守卫
  app.useGlobalGuards(new AuthGuard());


  await app.listen(Number(config.HTTP_PORT));
}
bootstrap();
