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
        let diff = timeToGetTo.getTime() - now.getTime();

        if (diff <= 0 || this.intervalUpdateId === -1) {
          window.clearInterval(this.intervalUpdateId);
          this.intervalUpdateId = -1;
          resolve(true);
        }

        this.setClock(diff);
      }, 1000); // Assuming the interval is set to 1 second

      resolve(false);
    });
  }

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

export class StyledPomoState extends PomoState {
  toggleStateBtn: HTMLButtonElement;
  background: HTMLElement = document.body;
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
    this.toggleStateBtn.addEventListener("click", this.toggleStateHook);
  }

  private toggleStateHook() {
    let res = super.flipCurrentState();
    if (res) {
      this.updateBackground(this.currentEvent);
    }
    console.log(this.coupledClock);
    if (this.currentEvent === PomoEvent.STARTED) {
      console.log("Starting clock");
      if (this.coupledClock.isClockRunning()) {
        this.startClock();
      }
    } else {
      this.coupledClock.stopUpdateHandler();
    }
  }
  private startClock() {
    let time = this.coupledClock.getClockTime();
    this.coupledClock.startUpdateHandler(time).then((res) => {
      if (res) {
        this.toggleStateHook();
      }
    });
  }
  private updateBackground(bool: PomoEvent) {
    let stopping = ["from-blue-500", "to-cyan-400"];
    let starting = ["from-red-200", "to-yellow-500"];

    if (bool === PomoEvent.STARTED) {
      this.background.classList.add.apply(this.background, starting);
      this.background.classList.remove.apply(this.background, stopping);
    } else {
      this.background.classList.add.apply(this.background, stopping);
      this.background.classList.remove.apply(this.background, starting);
    }
  }
}
