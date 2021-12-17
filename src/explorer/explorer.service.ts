import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { AccessorService } from './accessor.service';

@Injectable()
export class ExplorerService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(ExplorerService.name);
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly metadataAccessor: AccessorService,
  ) {}

  onApplicationShutdown(signal?: string) {
    this.logger.log('app has been shutdown.');
  }

  onApplicationBootstrap() {
    this.explore();
  }

  explore() {
    const providers = this.discoveryService.getProviders();
    const controllers = this.discoveryService.getControllers();

    [...providers, ...controllers]
      .filter((wrapper) => wrapper.isDependencyTreeStatic())
      .filter((wrapper) => wrapper.instance)
      .forEach((wrapper: InstanceWrapper) => {
        const { instance } = wrapper;

        // 类实例对象的metadata去做事情
        this.loadProcessor(instance);

        const prototype = Object.getPrototypeOf(instance);
        this.metadataScanner.scanFromPrototype(
          instance,
          prototype,
          (methodKey: string) => {
            // 类实例对象的metadata去做事情
            this.loadProcess(instance, methodKey);
          },
        );
      });
  }

  private loadProcessor(instance: Record<string, any>) {
    if (this.metadataAccessor.isProcessor(instance.constructor)) {
      const metadata = this.metadataAccessor.getProcessorMetadata(
        instance.constructor,
      );
      // do something
      this.logger.log(`Load Processor with ${JSON.stringify(metadata)}`);
    }
  }

  private loadProcess(instance: Record<string, any>, methodKey: string) {
    if (this.metadataAccessor.isProcess(instance[methodKey])) {
      const metadata = this.metadataAccessor.getProcessMetadata(
        instance[methodKey],
      );

      // do something
      this.logger.log(`Load Process with ${JSON.stringify(metadata)}`);
    }
  }
}
