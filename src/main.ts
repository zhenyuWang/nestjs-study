import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response/wrap-response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
        enableImplicitConversion: true, // 是否进行隐式转换
      },
    }),
  ); // 全局管道
  app.useGlobalFilters(new HttpExceptionFilter()); // 全局过滤器
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  ); // 全局拦截器

  const options = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options); // 生成文档对象
  SwaggerModule.setup('api-docs', app, document); // 文档路径
  await app.listen(3000);
}
bootstrap();
