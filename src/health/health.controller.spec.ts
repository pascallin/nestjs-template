import { Test, TestingModule } from '@nestjs/testing';
import { TerminusModule } from '@nestjs/terminus';
import { getConnectionToken } from '@nestjs/mongoose';

import { HealthController } from './health.controller';
import { getRedisClientProviderToken } from '../redis';
import { RedisHealthIndicator } from './redis.health';

describe('HealthController', () => {
  let controller: HealthController;

  const MockRedisClient = {
    ping(): string {
      return 'PONG';
    },
  };
  const MockMongooseClient = {
    readyState: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [
        RedisHealthIndicator,
        { provide: getRedisClientProviderToken(), useValue: MockRedisClient },
        { provide: getConnectionToken(), useValue: MockMongooseClient },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be check health succeed', async () => {
    expect(await controller.check());
  });
});
