import { Readable } from 'stream';

export type Environment = {
  isLocal: boolean;
  cube: {
      port: number;
      pgPort?: number;
      logs: Readable;
  };
  store: {
    port: number;
    logs: Readable;
  };
  data?: {
      port: number;
      logs: Readable;
  };
  stop: () => Promise<void>;
};
