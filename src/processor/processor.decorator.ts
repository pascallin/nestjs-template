import { SetMetadata } from '@nestjs/common';

import {
  MY_PROCESSOR,
  MY_PROCESS,
  ProcessEvent,
  MY_PROCESS_EVENT,
} from './constants';
import { ProcessorOptions, ProcessOptions } from './interfaces';

export function Process(opts: ProcessOptions): MethodDecorator {
  return SetMetadata(MY_PROCESS, opts);
}

export function Processor(opts: ProcessorOptions): ClassDecorator {
  return SetMetadata(MY_PROCESSOR, opts);
}

export const OnProcessEvent = (
  eventName: string,
  eventStatus: ProcessEvent,
): MethodDecorator => SetMetadata(MY_PROCESS_EVENT, { eventName, eventStatus });

export const OnProcessFailed = (opts: ProcessOptions) =>
  OnProcessEvent(opts.event, ProcessEvent.failed);
export const OnProcessCompleted = (opts: ProcessOptions) =>
  OnProcessEvent(opts.event, ProcessEvent.completed);
