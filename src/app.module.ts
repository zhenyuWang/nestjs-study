// import { Module, ValidationPipe } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { CoffeesController } from './coffees/coffees.controller';
// import { CoffeesService } from './coffees/coffees.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
// import * as Joi from '@hapi/joi';
import appConfig from './config/app.config';
// import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    // ConfigModule.forRoot(),
    // ConfigModule.forRoot({
    //   envFilePath:
    //     process.env.NODE_ENV === 'production' ? '.env.production' : '.env', // 指定环境变量配置文件
    //   ignoreEnvFile: true, // 忽略环境变量配置文件
    // }),
    // ConfigModule.forRoot({
    //   validationSchema: Joi.object({
    //     DATABASE_HOST: Joi.required(), // 必填
    //     DATABASE_PORT: Joi.number().default(5432), // 给定默认值
    //   }),
    // }),

    // 异步加载配置，不受这里先后顺序的影响，但是测试不异步也是可以的
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true, // NEVER USE IN PRODUCTION
      }),
    }),
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    CoffeesModule,
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DATABASE_HOST,
    //   port: parseInt(process.env.DATABASE_PORT),
    //   username: process.env.DATABASE_USERNAME,
    //   password: process.env.DATABASE_PASSWORD,
    //   database: process.env.DATABASE_NAME,
    //   autoLoadEntities: true,
    //   synchronize: true, // NEVER USE IN PRODUCTION
    // }),
    CoffeeRatingModule,
    DatabaseModule,
  ],
  // controllers: [AppController, CoffeesController],
  controllers: [AppController],
  // providers: [AppService, CoffeesService],
  providers: [
    AppService,
    // { provide: APP_PIPE, useValue: ValidationPipe }
  ],
})
export class AppModule {}
