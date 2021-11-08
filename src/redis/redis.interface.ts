import { RedisOptions } from 'ioredis';

export interface RedisAsyncOptionsInterface {
  imports?: any[];
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<RedisOptions>;
}
