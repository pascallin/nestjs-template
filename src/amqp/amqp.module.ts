import { Module, DynamicModule, OnModuleDestroy, Global } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import * as amqp from 'amqplib';

import {
  getAmqpConnectionProviderToken,
  getAmqpOptionsProviderToken,
} from './utils';
import { RabbitmqAsyncOptionsInterface } from './amqp.interface';

@Global()
@Module({})
export class AMQPModule implements OnModuleDestroy {
  constructor(private readonly moduleRef: ModuleRef) {}

  static forRootAsync(options: RabbitmqAsyncOptionsInterface): DynamicModule {
    const clientProvider = {
      provide: getAmqpConnectionProviderToken(),
      useFactory: async (
        config: amqp.Options.Connect,
      ): Promise<amqp.Connection> => await amqp.connect(config),
      inject: [getAmqpOptionsProviderToken()],
    };
    return {
      module: AMQPModule,
      imports: options.imports,
      providers: [
        {
          provide: getAmqpOptionsProviderToken(),
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        clientProvider,
      ],
      exports: [clientProvider],
    };
  }

  async onModuleDestroy(): Promise<void> {
    const connection = this.moduleRef.get<amqp.Channel>(
      getAmqpConnectionProviderToken(),
    );
    connection !== null && (await connection.close());
  }
}
