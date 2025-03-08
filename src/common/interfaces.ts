export enum PomoEvent {
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
  event: PomoEvent;
  code: String;
}

export class PomoState {
  currentEvent: PomoEvent = PomoEvent.STOPPED;
  private static code: String;
  listeners: Function[] = [];
  constructor(code: String) {
    PomoState.code = code;
  }

  getCode(): String {
    return PomoState.code;
  }

  registerListener(handler: Function): void {
    this.listeners.push(handler);
  }
  private broadcastUpdate(): void {
    this.listeners.forEach(() => {
      return this.currentEvent;
    });
  }

  flipCurrentState(): boolean {
    switch (this.currentEvent) {
      case PomoEvent.CONNECT:
      case PomoEvent.STOPPED:
        this.setCurrentEvent(PomoEvent.STARTED);
        return true;
      case PomoEvent.STARTED:
        this.setCurrentEvent(PomoEvent.STOPPED);
        return true;
    }
    return false;
  }

  setCurrentEvent(newEvent: PomoEvent) {
    this.currentEvent = newEvent;
    this.broadcastUpdate();
  }

  genMsgBlock(): MessageBlock {
    return { event: this.currentEvent, code: PomoState.code };
  }
}
