import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from './config/configuration';
import {
  RequestLogInterceptor,
  RequestIdInterceptor,
  ResponseInterceptor,
} from './app/middlewares';
import { HealthModule } from './health/health.module';
import { AMQPModule } from './amqp';
import { RedisModule } from './redis';
import { ExampleModule } from './example/example.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    HealthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        user: configService.get<string>('MONGO_USER'),
        pass: configService.get<string>('MONGO_PASS'),
        dbName: configService.get<string>('MONGO_DATABASE'),
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        host: configService.get<string>('REDIS_HOST'),
        password: configService.get<string>('REDIS_PASSWORD'),
        port: parseInt(configService.get<string>('REDIS_PORT')),
        db: parseInt(configService.get<string>('REDIS_DATABASE')),
      }),
      inject: [ConfigService],
    }),
    AMQPModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        hostname: configService.get<string>('RABBITMQ_HOST'),
        port: parseInt(configService.get<string>('RABBITMQ_PORT')),
        username: configService.get<string>('RABBITMQ_USERNAME'),
        password: configService.get<string>('RABBITMQ_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    // NOTE: just for example
    ExampleModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestIdInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLogInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
