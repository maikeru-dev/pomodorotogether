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
  currentEvent: PomoEvent = PomoEvent.CONNECT;
  private static code: String;
  listeners: Function[] = [];
  constructor(code: String) {
    PomoState.code = code;
  }

  getCode(): String {
    return PomoState.code;
  }

  registerListener(handler: Function): Function {
    this.listeners.push(handler);
    return handler;
  }
  protected broadcastUpdate(): void {
    this.listeners.forEach((listener) => {
      return listener(this);
    });
  }

  protected noEchoBrodcast(excludeListener: Function): void {
    this.listeners.forEach((listener) => {
      console.log(listener);
      if (listener.name !== excludeListener.name) {
        listener(this);
      }
    });
  }
  silentUpdate(newEvent: PomoEvent): void {
    this.currentEvent = newEvent;
  }
  excludedListenerUpdate(newEvent: PomoEvent, excludeListener: Function): void {
    this.currentEvent = newEvent;
    this.noEchoBrodcast(excludeListener);
  }

  getCurrentEvent() {
    return this.currentEvent;
  }

  flipCurrentState(): boolean {
    switch (this.currentEvent) {
      case PomoEvent.STOPPED:
        this.setCurrentEvent(PomoEvent.STARTED);
        return true;
      case PomoEvent.STARTED:
        this.setCurrentEvent(PomoEvent.STOPPED);
        return true;
    }
    return false;
  }
  processMessage(newEvent: PomoEvent): void {
    if (newEvent === PomoEvent.CONNECT) {
      // Do nothing
      return;
    }
    this.setCurrentEvent(newEvent);
  }
  setCurrentEvent(newEvent: PomoEvent) {
    this.currentEvent = newEvent;
    this.broadcastUpdate();
  }

  genMsgBlock(): MessageBlock {
    return { event: this.currentEvent, code: PomoState.code };
  }
}
