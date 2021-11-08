import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from './config/configuration';
import { HealthModule } from './health/health.module';
import { AMQPModule } from './amqp';
import { RedisModule } from './redis';

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
  ],
})
export class AppModule {}
