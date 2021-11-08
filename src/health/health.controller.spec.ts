import { Test, TestingModule } from '@nestjs/testing';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { getRedisClientProviderToken } from '../redis';
import { RedisHealthIndicator } from './redis.health';

describe('HealthController', () => {
  let controller: HealthController;

  class MockRedisClient {
    static ping(): string {
      return 'PONG';
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [
        RedisHealthIndicator,
        { provide: getRedisClientProviderToken(), useClass: MockRedisClient },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
