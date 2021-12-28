import { Injectable, Inject } from '@nestjs/common';
import * as Redis from 'ioredis';

import { REDIS_CLIENT_PROVIDER } from './redis.constants';

@Injectable()
export class RedisConnService {
  constructor(
    @Inject(REDIS_CLIENT_PROVIDER)
    private readonly clients: Map<string, Redis.Redis>,
  ) {}

  getConnection(name: string): Redis.Redis {
    return this.clients.get(name);
  }
}
