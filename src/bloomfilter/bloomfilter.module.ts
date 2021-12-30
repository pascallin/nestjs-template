import { Module } from '@nestjs/common';
import { BloomFilterService } from './bloomfilter.service';

@Module({
  providers: [BloomFilterService],
  exports: [BloomFilterService],
})
export class BloomFilterModule {}
