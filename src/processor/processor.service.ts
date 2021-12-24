import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';

import { AccessorService } from './accessor.service';
import { ProcessEvent } from './constants';

@Injectable()
export class ProcessorModuleService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(ProcessorModuleService.name);
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly metadataAccessor: AccessorService,
    private readonly eventEmitter: EventEmitter2,
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
        const processor = this.loadProcessor(instance);

        const prototype = Object.getPrototypeOf(instance);
        this.metadataScanner.scanFromPrototype(
          instance,
          prototype,
          (methodKey: string) => {
            // 类实例对象的metadata去做事情
            this.loadProcess(instance, methodKey, processor);
            this.loadEventListener(instance, methodKey, processor);
          },
        );
      });
  }

  private loadProcessor(instance: Record<string, any>): string {
    if (this.metadataAccessor.isProcessor(instance.constructor)) {
      const metadata = this.metadataAccessor.getProcessorMetadata(
        instance.constructor,
      );
      // do something
      this.logger.debug(`Load Processor with ${JSON.stringify(metadata)}`);
      return metadata.namespace;
    }
    return;
  }

  private loadProcess(
    instance: Record<string, any>,
    methodKey: string,
    processor: string,
  ) {
    if (this.metadataAccessor.isProcess(instance[methodKey])) {
      const metadata = this.metadataAccessor.getProcessMetadata(
        instance[methodKey],
      );

      // workflow
      this.logger.debug(`Load Process with ${JSON.stringify(metadata)}`);

      const processEventName = `${processor}.${metadata.event}`;
      const completedEventName = `${processor}.${metadata.event}.${ProcessEvent.completed}`;
      const failedEventName = `${processor}.${metadata.event}.${ProcessEvent.failed}`;

      this.logger.debug(`Load Processor events ${processEventName}`);

      this.eventEmitter.on(
        processEventName,
        async (...args: unknown[]) => {
          try {
            await instance[methodKey].call(instance, ...args);
            this.eventEmitter.emit(completedEventName, ...args);
          } catch (e) {
            this.eventEmitter.emit(failedEventName, ...args, e);
          }
        },
        { async: true }, // NOTE: try-catch needed async
      );
    }
  }

  loadEventListener(
    instance: Record<string, any>,
    methodKey: string,
    processor: string,
  ) {
    if (this.metadataAccessor.isEventListener(instance[methodKey])) {
      const metadata = this.metadataAccessor.getEventMetadata(
        instance[methodKey],
      );

      this.logger.debug(
        `Load Processor events ${processor}.${metadata.eventName}.${metadata.eventStatus}`,
      );

      this.eventEmitter.on(
        `${processor}.${metadata.eventName}.${metadata.eventStatus}`,
        async (...args: unknown[]) => {
          await instance[methodKey].call(instance, ...args);
        },
        { async: true }, // NOTE: needed async to serialize workflow
      );
    }
  }
}
