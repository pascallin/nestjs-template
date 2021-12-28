import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';

import { RedisConnService } from '../redis';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private readonly redisConnService: RedisConnService) {
    super();
  }
  async isHealthy(): Promise<HealthIndicatorResult> {
    const res = await this.redisConnService.getConnection('test').ping();
    const isHealthy = res == 'PONG';
    const result = this.getStatus('redis connection', isHealthy);

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('Redis Connection Ping failed', result);
  }

  async isClusterHealthy(): Promise<HealthIndicatorResult> {
    const res = await this.redisConnService.getConnection('cluster').ping();
    const isHealthy = res == 'PONG';
    const result = this.getStatus('redis cluster connection', isHealthy);

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('Redis Connection Ping failed', result);
  }
}
