import { PomoState } from "../common/interfaces.js";
// WARN: Client only code

class CoupledClock {
  protected clockMinute = document.getElementById(
    "clock-minute",
  ) as HTMLInputElement;
  protected clockSecond = document.getElementById(
    "clock-second",
  ) as HTMLInputElement;
  protected intervalUpdateId: number = -1;

  constructor() {
    this.clockMinute = document.getElementById(
      "clock-minute",
    ) as HTMLInputElement;
    this.clockSecond = document.getElementById(
      "clock-second",
    ) as HTMLInputElement;
  }

  startUpdateHandler(timeToGetTo: Date) {
    return new Promise<void>((resolve) => {
      this.intervalUpdateId = window.setInterval(() => {
        let now = new Date();
        let diff = timeToGetTo.getTime() - now.getTime();

        if (diff <= 0 || this.intervalUpdateId === -1) {
          window.clearInterval(this.intervalUpdateId);
          resolve();
          return;
        }

        this.setClock(diff);
      }, 1000); // Assuming the interval is set to 1 second
    });
  }

  stopUpdateHandler() {
    this.intervalUpdateId = -1;
  }

  private setClock(time: number) {
    this.setClockMinute(Math.floor(time / 60000));
    this.setClockSecond(Math.floor((time % 60000) / 1000));
  }
  private setClockMinute(minute: number) {
    this.clockMinute.value = minute.toString();
  }
  private setClockSecond(second: number) {
    this.clockSecond.value = second.toString();
  }
}

class StyledPomoState extends PomoState {
  toggleStateBtn: HTMLButtonElement;
  background: HTMLElement = document.body;
  coupledClock: CoupledClock;

  constructor(code: String) {
    super(code);
    this.toggleStateBtn = document.getElementById(
      "toggle-state-btn",
    ) as HTMLButtonElement;
    this.coupledClock = new CoupledClock();
    this.initHook();
  }
  initHook(): void {
    this.toggleStateBtn.addEventListener("click", this.toggleStateHook);
  }
  toggleStateHook() {}
}
