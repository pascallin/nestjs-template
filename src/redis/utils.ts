import { REDIS_CLIENT_PROVIDER, REDIS_MODULE_OPTIONS } from './redis.constants';

export function getRedisClientProviderToken(): any {
  return REDIS_CLIENT_PROVIDER;
}

export function getRedisModuleOptionsProviderToken(): any {
  return REDIS_MODULE_OPTIONS;
}
