import { Logger } from '@nestjs/common';
import { Request } from 'express';

export type AppRequest = Request & {
  requestId: string;
  tracingLog: Logger;
};
