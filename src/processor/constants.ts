export const MY_PROCESSOR = Symbol('MY_PROCESSOR');
export const MY_PROCESS = Symbol('MY_PROCESS');
export const MY_PROCESS_EVENT = Symbol('MY_PROCESS_EVENT');

export enum ProcessEvent {
  'process' = 'process',
  'failed' = 'failed',
  'completed' = 'completed',
}
