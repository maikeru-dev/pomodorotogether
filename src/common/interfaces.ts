import { WebSocket } from "ws";

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
}

export interface ClockInfo {
  currentTime: number;
  currentCycle: number;
}

export interface MessageBlock {
  event: PomoEvent;
  clockInfo?: ClockInfo;
  code: string;
}

export class PomoState {
  currentEvent: PomoEvent = PomoEvent.CONNECT;
  private static code: string;
  listeners: Function[] = [];
  constructor(code: string) {
    PomoState.code = code;
  }

  getCode(): string {
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

  protected noEchoBrodcast(
    msgBlock: MessageBlock,
    excludeListener: Function,
  ): void {
    this.listeners.forEach((listener) => {
      console.log(listener);
      if (listener.name !== excludeListener.name) {
        listener(this, msgBlock);
      }
    });
  }
  silentUpdate(newEvent: PomoEvent): void {
    this.currentEvent = newEvent;
  }
  excludedListenerUpdate(
    msgBlock: MessageBlock,
    excludeListener: Function,
  ): void {
    if (msgBlock.event === PomoEvent.CONNECT) {
      // Do nothing
      return;
    }
    this.noEchoBrodcast(msgBlock, excludeListener);
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

export class SocketWrapper {
  private _socket: WebSocket;
  private _admin: boolean = false;
  private _code: string;
  private _lastAdminConfig: MessageBlock | undefined;

  constructor(socket: WebSocket) {
    this._code = "";
    this._socket = socket;
    this._admin = false;
    this._lastAdminConfig = undefined;
  }

  public verifyCode(code: string): boolean {
    if (code === this._code) {
      return true;
    }
    return false;
  }
  public set code(value: string) {
    this._code = value;
  }

  public get code(): string {
    return this._code;
  }

  public get socket(): WebSocket {
    return this._socket;
  }

  public get admin(): boolean {
    return this._admin;
  }
  public set admin(value: boolean) {
    this._admin = value;
  }

  public get lastAdminConfig(): MessageBlock | undefined {
    return this._lastAdminConfig;
  }
  public set lastAdminConfig(value: MessageBlock | undefined) {
    this._lastAdminConfig = value;
  }
}
