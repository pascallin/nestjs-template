import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { Redis } from 'ioredis';

import { InjectRedis } from '../redis';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(@InjectRedis() private redisClient: Redis) {
    super();
  }
  async isHealthy(): Promise<HealthIndicatorResult> {
    const res = await this.redisClient.ping();
    const isHealthy = res == 'PONG';
    const result = this.getStatus('redis connection', isHealthy);

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('Redis Connection Ping failed', result);
  }
}
