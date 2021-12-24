/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  MY_PROCESSOR,
  MY_PROCESS,
  MY_PROCESS_EVENT,
  ProcessEvent,
} from './constants';
import { ProcessorOptions, ProcessOptions } from './interfaces';

@Injectable()
export class AccessorService {
  constructor(private readonly reflector: Reflector) {}

  isProcess(target: Type<any> | Function): boolean {
    if (!target) {
      return false;
    }
    return !!this.reflector.get(MY_PROCESS, target);
  }

  getProcessMetadata(target: Type<any> | Function): ProcessOptions | undefined {
    return this.reflector.get(MY_PROCESS, target);
  }

  isProcessor(target: Type<any> | Function): boolean {
    if (!target) {
      return false;
    }
    return !!this.reflector.get(MY_PROCESSOR, target);
  }

  getProcessorMetadata(
    target: Type<any> | Function,
  ): ProcessorOptions | undefined {
    return this.reflector.get(MY_PROCESSOR, target);
  }

  isEventListener(target: Type<any> | Function): boolean {
    if (!target) {
      return false;
    }
    return !!this.reflector.get(MY_PROCESS_EVENT, target);
  }

  getEventMetadata(target: Type<any> | Function): {
    eventName: string;
    eventStatus: ProcessEvent;
  } {
    return this.reflector.get(MY_PROCESS_EVENT, target);
  }
}
