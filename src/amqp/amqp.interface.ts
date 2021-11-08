import { Options } from 'amqplib';

export interface RabbitmqAsyncOptionsInterface {
  imports?: any[];
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<Options.Connect>;
}
