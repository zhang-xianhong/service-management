// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import customConfig from './config';
import corsConfig from './config/cors';
import { AllExceptionsFilter } from './shared/filters/exceptions.filter';
import { TraceMiddleware } from './shared/middleware/trace.middleware';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthorityGuard } from './shared/guards/auth.guard';
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
  // app.enableCors(corsConfig);
  // 统一前缀
  app.setGlobalPrefix('/api');

  const nestWinston = app.get(WINSTON_MODULE_NEST_PROVIDER);

  // 全局过滤器
  app.useGlobalFilters(new AllExceptionsFilter(nestWinston.logger));
  // 全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 全局守卫
  // 暂时无需鉴权，待使用时在开启
  // app.useGlobalGuards(new AuthorityGuard(app.get(Reflector)));

  await app.listen(Number(config.HTTP_PORT));
}
bootstrap();
