import {
  AMQP_CONNECTION_PROVIDER,
  AMQP_OPTIONS_PROVIDER,
} from './amqp.constants';

export function getAmqpConnectionProviderToken(): any {
  return AMQP_CONNECTION_PROVIDER;
}

export function getAmqpOptionsProviderToken(): any {
  return AMQP_OPTIONS_PROVIDER;
}
