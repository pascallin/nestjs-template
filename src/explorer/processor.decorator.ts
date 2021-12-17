import { SetMetadata } from '@nestjs/common';
import { MY_PROCESSOR, MY_PROCESS } from './constants';

export function Process(opts: { event: string }): MethodDecorator {
  return SetMetadata(MY_PROCESS, opts); // NOTE: no options for now
}

export function Processor(opts: { namespace: string }): ClassDecorator {
  return SetMetadata(MY_PROCESSOR, opts);
}
