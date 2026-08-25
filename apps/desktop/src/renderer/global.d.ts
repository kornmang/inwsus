import type { InwsusApi } from '@inwsus/ipc-contracts';

declare global {
  interface Window {
    readonly inwsus: InwsusApi;
  }
}

export {};
