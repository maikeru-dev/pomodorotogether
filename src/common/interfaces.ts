export enum PomodoroEvent {
  STOPPED,
  STARTED,
  LONG_STOP,
  SYNC_CONFIG,
  AWK_SYNC,
  CONNECT,
}

export interface PomodoroConfig {
  workTime: number;
  breakTime: number;
  extendedBreakTime: number;
  cycleCount: number;
  secret: string;
}

export interface PomodoroState {
  currentTime: number;
  currentCycle: number;
}

export interface MessageBlock {
  event: PomodoroEvent;
}
