import { Module, DynamicModule, Global, OnModuleDestroy } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import IORedis, { RedisOptions, Redis } from 'ioredis';

import {
  getRedisClientProviderToken,
  getRedisOptionsProviderToken,
} from './utils';
import { RedisAsyncOptionsInterface } from './redis.interface';

@Global()
@Module({})
export class RedisModule implements OnModuleDestroy {
  constructor(private readonly moduleRef: ModuleRef) {}

  static forRootAsync(options: RedisAsyncOptionsInterface): DynamicModule {
    const clientProvider = {
      provide: getRedisClientProviderToken(),
      useFactory: (config: RedisOptions): IORedis.Redis => new IORedis(config),
      inject: [getRedisOptionsProviderToken()],
    };
    return {
      module: RedisModule,
      imports: options.imports,
      providers: [
        {
          provide: getRedisOptionsProviderToken(),
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        clientProvider,
      ],
      exports: [clientProvider],
    };
  }

  async onModuleDestroy(): Promise<void> {
    const connection = this.moduleRef.get<Redis>(getRedisClientProviderToken());
    connection !== null && (await connection.disconnect());
  }
}
