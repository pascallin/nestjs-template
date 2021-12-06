import { Request } from 'express';

export type AppRequest = Request & {
  requestId: string;
};
