import {
  REDIS_CLIENT_PROVIDER,
  REDIS_OPTIONS_PROVIDER,
} from './redis.constants';

export function getRedisClientProviderToken(): any {
  return REDIS_CLIENT_PROVIDER;
}

export function getRedisOptionsProviderToken(): any {
  return REDIS_OPTIONS_PROVIDER;
}
