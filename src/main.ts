import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动删除未知属性,
      // 自动转换类型 包括请求 body 转为 dto 实例，路由参数转为期望类型，id: string => id: number
      // 注意：会轻微影响性能，如果确定开启，需确认性能影响是否可接受
      transform: true,
      forbidNonWhitelisted: true, // 如果有未知属性，抛出异常
      transformOptions: {
        enableImplicitConversion: true, // 如果开启，会把 query 参数自动转换类型
      },
    }),
  ); // 全局管道
  await app.listen(3000);
}
bootstrap();
