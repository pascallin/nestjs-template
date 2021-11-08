import { Inject } from '@nestjs/common';

import { getRedisClientProviderToken } from './utils';

export const InjectRedis = () => {
  return Inject(getRedisClientProviderToken());
};
