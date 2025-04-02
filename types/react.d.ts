// react.d.ts

import { ReactNode } from "react";
import { AudioRecorderOptions } from ".";

export const RecorderStates: {
  INITIAL: 0;
  STARTING: 1;
  RECORDING: 2;
  PAUSED: 3;
  ENCODING: 4;
  COMPLETE: 5;
  ERROR: 6;
  COUNTDOWN: 7;
};

export function useSimpleAudioRecorder(options?: {
  preloadWorker?: boolean;
  onDataAvailable?: (data: Int8Array) => void;
  onTimeStep?: (time: number) => void;
  onComplete?: (result: { mp3Blob: Blob; mp3Url: string }) => void;
  onError?: (error: Error) => void;
  options?: Omit<AudioRecorderOptions, "streaming">;
  cleanup?: boolean;
  timeUpdateStep?: number;
  countdown?: number;
}): {
  error: Error | null;
  errorStr: string | null;
  time: number;
  countdownTimeLeft: number;
  mp3Blobs: Blob[];
  mp3Urls: string[];
  mp3Blob: Blob | undefined;
  mp3Url: string | undefined;
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  clear: () => void;
  recorderState: number;
  getProps: () => { recorderState: number };
};

export function SimpleAudioRecorder(props: {
  recorderState: number;
  viewInitial: ReactNode;
  viewStarting?: ReactNode;
  viewCountdown?: ReactNode;
  viewRecording: ReactNode;
  viewPaused?: ReactNode;
  viewEncoding?: ReactNode;
  viewComplete?: ReactNode;
  viewError?: ReactNode;
}): JSX.Element;

export function preloadWorker(): void;
