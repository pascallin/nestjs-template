import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { BloomFilter } from '@albert-team/rebloom';
import { ConfigService } from '@nestjs/config';

const FILTER_NAME = 'message';

@Injectable()
export class BloomFilterService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BloomFilterService.name);
  private readonly filter: BloomFilter;

  constructor(private readonly configService: ConfigService) {
    this.filter = new BloomFilter(FILTER_NAME, {
      host: configService.get<string>('BF_REDIS_HOST'),
      port: configService.get<number>('BF_REDIS_PORT'),
      // redisClientOptions: { password: 'scrtpassword' },
    });
  }
  async onModuleDestroy() {
    await this.filter.disconnect();
    this.logger.log('redis bloomfilter disconnected');
  }
  async onModuleInit() {
    await this.filter.connect();
    this.logger.log('redis bloomfilter connected');
  }

  async addMessage(message: string) {
    await this.filter.add(message);
  }

  async checkExists(message: string) {
    await this.filter.exists(message);
  }
}
