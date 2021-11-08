import { Inject } from '@nestjs/common';

import { getAmqpConnectionProviderToken } from './utils';

export const InjectAmqpConnection = () => {
  return Inject(getAmqpConnectionProviderToken());
};
