import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { ProcessorModuleService } from './processor.service';
import { AccessorService } from './accessor.service';

@Module({})
export class ProcessorModule {
  static register() {
    return {
      module: ProcessorModule,
      imports: [ProcessorModule.registerCore()],
    };
  }
  private static registerCore() {
    return {
      global: true,
      module: ProcessorModule,
      imports: [DiscoveryModule],
      providers: [ProcessorModuleService, AccessorService],
    };
  }
}
