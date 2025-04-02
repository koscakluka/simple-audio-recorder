// index.d.ts

export class Timer {
  private startTime: number | null;
  private stoppedTime: number | null;

  constructor();

  /**
   * Resets the timer, clearing start and stop times.
   */
  reset(): void;

  /**
   * Starts the timer. If the timer is already running, it will resume.
   */
  start(): void;

  /**
   * Resets the timer and immediately starts it.
   */
  resetAndStart(): void;

  /**
   * Stops the timer. If the timer is already stopped, this has no effect.
   */
  stop(): void;

  /**
   * Gets the elapsed time in milliseconds.
   * If the timer is running, the time is calculated from the start time.
   * If the timer is stopped, the time reflects the duration it was running.
   * @returns Elapsed time in milliseconds.
   */
  getTime(): number;
}

declare namespace WorkerEncoderNamespace {
  interface JobCallback {
    onencoded?: (srcBufLen: number) => void;
    ondataavailable?: (data: any) => void;
    onstopped?: () => void;
  }

  type WorkerStates = {
    INACTIVE: 0;
    LOADING: 1;
    READY: 2;
    ERROR: 3;
  };
}

/**
 * The main class for managing worker-based encoding jobs.
 */
declare class WorkerEncoder {
  /**
   * Unique ID for the encoding job.
   */
  private jobId: string;

  /**
   * Options used for the encoding job.
   */
  private options: Record<string, any>;

  /**
   * Amount of data queued for encoding (in samples).
   */
  private queuedData: number;

  /**
   * Callback executed when data is available.
   */
  public ondataavailable?: (data: any) => void;

  /**
   * Callback executed when the encoding job is stopped.
   */
  public onstopped?: () => void;

  /**
   * Constructor for creating a new WorkerEncoder instance.
   * @param options - Configuration options for the encoder.
   */
  constructor(options: Record<string, any>);

  /**
   * Preloads the worker with the given URL.
   * @param workerUrl - The URL of the worker script.
   */
  static preload(workerUrl: string): void;

  /**
   * Waits for the worker to be ready. If the worker is not ready, it will attempt to load it.
   * @param workerUrl - The URL of the worker script.
   * @returns A promise that resolves when the worker is ready.
   */
  static waitForWorker(workerUrl: string): Promise<void>;

  /**
   * Starts the encoding job.
   */
  start(): void;

  /**
   * Sends audio data buffers to the worker for encoding.
   * @param buffers - The audio data buffers to be encoded.
   */
  sendData(buffers: Float32Array[]): void;

  /**
   * Retrieves the length of the data that is not yet encoded.
   * @returns The length of the queued data.
   */
  getQueuedDataLen(): number;

  /**
   * Stops the encoding job.
   */
  stop(): void;
}

export declare type AudioRecorderOptions = {
  recordingGain?: number;
  encoderBitRate?: number;
  streaming?: boolean;
  streamBufferSize?: number;
  forceScriptProcessor?: boolean;
  constraints?: {
    channelCount?: number;
    autoGainControl?: boolean;
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
  };
};

declare type AudioRecorderState =
  | "STOPPED"
  | "RECORDING"
  | "PAUSED"
  | "STARTING"
  | "STOPPING";

declare class AudioRecorder {
  constructor(options?: AudioRecorderOptions);

  static isRecordingSupported(): boolean;

  static initWorker(): void;

  readonly options: AudioRecorderOptions;
  readonly state: AudioRecorderState;
  readonly audioContext: AudioContext | null;
  readonly sourceNode: MediaStreamAudioSourceNode | null;
  readonly encoder: WorkerEncoder | null;
  readonly encodedData: Blob[] | null;
  readonly timer: Timer;
  readonly time: number;

  ondataavailable?: (data: Blob) => void;
  onstart?: () => void;
  onstop?: (data: Blob | undefined) => void;
  onerror?: (error: Error) => void;

  start(paused?: boolean): Promise<void>;

  stop(): Promise<Blob | undefined>;

  pause(): void;

  resume(): void;

  setRecordingGain(gain: number): void;

  getEncodingQueueSize(): number;

  private useAudioWorklet(): boolean;

  private createAndStartEncoder(numberOfChannels: number): void;

  private createOutputNode(numberOfChannels: number): void;

  private createAudioNodes(numberOfChannels: number): void;

  private cleanupAudioNodes(): void;

  private __start(paused: boolean): Promise<void>;

  private __stop(): Promise<Blob | undefined>;

  private stoppingCheck(): void;
}

export default AudioRecorder;
export { WorkerEncoder, WorkerEncoderNamespace };
