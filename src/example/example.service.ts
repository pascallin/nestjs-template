import { Injectable, Logger } from '@nestjs/common';

import {
  Process,
  Processor,
  OnProcessCompleted,
  OnProcessFailed,
} from '../explorer';

@Injectable()
@Processor({ namespace: 'example' })
export class ExampleService {
  private readonly logger = new Logger(ExampleService.name);
  @Process({ event: 'test' })
  async run() {
    this.logger.log('run');
    // try error
    throw new Error('running error');
  }

  @OnProcessCompleted({ event: 'test' })
  async onCompleted() {
    this.logger.log('onComplete');
  }

  @OnProcessFailed({ event: 'test' })
  async onFailed() {
    this.logger.log('onFailed');
  }
}
