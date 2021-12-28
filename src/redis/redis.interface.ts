import { RedisOptions, ClusterNode } from 'ioredis';

export interface RedisModuleOptions {
  name?: string;
  isCluster?: boolean;
  option: RedisOptions | ClusterNode[];
}

export interface RedisModuleAsyncOptions {
  imports?: any[];
  inject?: any[];
  useFactory?: (
    ...args: any[]
  ) => Promise<RedisModuleOptions | RedisModuleOptions[]>;
}
