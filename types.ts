
export enum TestStatus {
  IDLE = 'IDLE',
  TESTING_DOWNLOAD = 'TESTING_DOWNLOAD',
  TESTING_UPLOAD = 'TESTING_UPLOAD',
  TESTING_PING = 'TESTING_PING',
  COMPLETE = 'COMPLETE',
}

export type View = 'speedtest' | 'history' | 'tools';

export interface GraphDataPoint {
  time: number;
  download?: number;
  upload?: number;
}

export interface Server {
  id: number;
  name: string;
  provider: string;
  location: string;
}
