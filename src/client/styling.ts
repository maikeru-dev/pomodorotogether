import { PomoEvent, PomoState } from "../common/interfaces.js";
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
    return new Promise<boolean>((resolve) => {
      this.intervalUpdateId = window.setInterval(() => {
        let now = new Date();
        console.log(timeToGetTo.getTime(), now.getTime());
        let diff = timeToGetTo.getTime() - now.getTime();

        if (Math.trunc(diff / 1000) <= 0 || this.intervalUpdateId === -1) {
          resolve(true);
          this.stopUpdateHandler();
        }

        this.setClock(diff);
      }, 1100); // Assuming the interval is set to 1 second
    });
  }

  // This gets the current time values out of the user clock
  getClockTime() {
    const now = new Date();
    const minutes = parseInt(this.clockMinute.value, 10);
    const seconds = parseInt(this.clockSecond.value, 10);

    return new Date(now.getTime() + minutes * 60000 + seconds * 1000);
  }

  isClockRunning() {
    return this.intervalUpdateId !== -1;
  }

  stopUpdateHandler() {
    window.clearInterval(this.intervalUpdateId);
    this.intervalUpdateId = -1;
  }

  private setClock(time: number) {
    this.setClockMinute(Math.floor(time / 60000));
    this.setClockSecond(Math.floor((time % 60000) / 1000));
  }
  private setClockMinute(minute: number) {
    this.clockMinute.value = minute.toString().padStart(2, "0");
  }
  private setClockSecond(second: number) {
    this.clockSecond.value = second.toString().padStart(2, "0");
  }
}

export class StyledPomoState extends PomoState {
  toggleStateBtn: HTMLButtonElement;
  background: HTMLElement = document.getElementById("overlay") as HTMLElement;
  coupledClock: CoupledClock;

  constructor(code: String) {
    super(code);
    this.toggleStateBtn = document.getElementById(
      "toggleStateBtn",
    ) as HTMLButtonElement;
    this.coupledClock = new CoupledClock();
    this.initHook();
  }
  initHook(): void {
    this.toggleStateBtn.addEventListener("click", () => {
      //TODO: Add Clock value checks here
      this.toggleStateHook();
    });
  }

  private toggleStateHook() {
    let res = super.flipCurrentState();
    console.log(res, super.getCurrentEvent());
    if (res) {
      this.updateBackground(this.currentEvent);
    }
    if (this.currentEvent === PomoEvent.STARTED) {
      if (!this.coupledClock.isClockRunning()) {
        this.startClock();
      }
    } else {
      this.coupledClock.stopUpdateHandler();
    }
  }
  private startClock() {
    let time = this.coupledClock.getClockTime();
    this.coupledClock.startUpdateHandler(time).then((res) => {
      console.log("Clock has stopped", res);
      if (res) {
        this.toggleStateHook();
      }
    });
  }
  private updateBackground(bool: PomoEvent) {
    this.background.classList.toggle("overlay-visible");
  }
}
