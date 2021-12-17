import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { ExplorerService } from './explorer.service';
import { AccessorService } from './accessor.service';

@Module({})
export class ExplorerModule {
  static register() {
    return {
      module: ExplorerModule,
      imports: [ExplorerModule.registerCore()],
    };
  }
  private static registerCore() {
    return {
      global: true,
      module: ExplorerModule,
      imports: [DiscoveryModule],
      providers: [ExplorerService, AccessorService],
    };
  }
}
