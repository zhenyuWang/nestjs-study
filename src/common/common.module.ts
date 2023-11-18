import {
  MiddlewareConsumer,
  Module,
  NestModule,
  // RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key/api-key.guard';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './middleware/logging/logging.middleware';

@Module({
  imports: [ConfigModule],
  providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 为所有路由添加中间件
    consumer.apply(LoggingMiddleware).forRoutes('*');
    // 为所有路由添加中间件，但排除 coffees 路由
    // consumer.apply(LoggingMiddleware).exclude('coffees').forRoutes('*');
    // 为 coffees 路由添加中间件
    // consumer.apply(LoggingMiddleware).forRoutes('coffees');
    // 为 coffees 路由的 Get 请求添加中间件
    // consumer
    //   .apply(LoggingMiddleware)
    //   .forRoutes({ path: 'coffees', method: RequestMethod.GET });
  }
}
