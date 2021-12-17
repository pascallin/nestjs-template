import { Injectable, Logger } from '@nestjs/common';

import { Process, Processor } from '../explorer';

@Injectable()
@Processor({ namespace: 'example' })
export class ExampleService {
  private readonly logger = new Logger(ExampleService.name);
  @Process({ event: 'test' })
  async run() {
    this.logger.log('here');
  }
}
