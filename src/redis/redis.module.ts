import { Module, DynamicModule, Global, Provider } from '@nestjs/common';
import { nanoid } from 'nanoid';
import * as Redis from 'ioredis';

import {
  getRedisModuleOptionsProviderToken,
  getRedisClientProviderToken,
} from './utils';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
import { RedisConnService } from './redis-conn.service';

@Global()
@Module({
  providers: [RedisConnService],
  exports: [RedisConnService],
})
export class RedisModule {
  static register(options: RedisModuleOptions | RedisModuleOptions[]) {
    return {
      module: RedisModule,
      providers: [
        {
          provide: getRedisModuleOptionsProviderToken(),
          useValue: options,
        },
        RedisModule.createClientProvider(),
      ],
      exports: [RedisConnService],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: options.imports,
      providers: [
        {
          provide: getRedisModuleOptionsProviderToken(),
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        RedisModule.createClientProvider(),
      ],
      exports: [RedisConnService],
    };
  }

  static createClientProvider(): Provider {
    return {
      provide: getRedisClientProviderToken(),
      useFactory: async (
        options: RedisModuleOptions | RedisModuleOptions[],
      ): Promise<Map<string, Redis.Redis | Redis.Cluster>> => {
        const clients = new Map<string, Redis.Redis>();
        if (Array.isArray(options)) {
          options.map((option: RedisModuleOptions) => {
            const key = option.name || nanoid();
            let client;
            if (option.isCluster) {
              client = new Redis.Cluster(option.option as Redis.ClusterNode[]);
            } else {
              client = new Redis(option.option as Redis.RedisOptions);
            }
            clients.set(key, client);
          });
        } else {
          const key = options.name || nanoid();
          let client;
          if (options.isCluster) {
            client = new Redis.Cluster(options.option as Redis.ClusterNode[]);
          } else {
            client = new Redis(options.option as Redis.RedisOptions);
          }
          clients.set(key, client);
        }
        return clients;
      },
      inject: [getRedisModuleOptionsProviderToken()],
    };
  }
}
