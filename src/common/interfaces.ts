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

export class PomoState {
  currentEvent: PomodoroEvent = PomodoroEvent.STOPPED;
  listeners: Function[] = [];
  constructor() {}

  registerListener(handler: Function): void {
    this.listeners.push(handler);
  }
  private broadcastUpdate(): void {
    this.listeners.forEach(() => {
      return this.currentEvent;
    });
  }

  setCurrentEvent(newEvent: PomodoroEvent) {
    this.currentEvent = newEvent;
    this.broadcastUpdate();
  }

  genMsgBlock(): MessageBlock {
    return { event: this.currentEvent };
  }
}
