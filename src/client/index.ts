import {
  MessageBlock,
  PomodoroEvent,
  PomodoroConfig,
  PomodoroState,
} from "../common/interfaces";
import { formMessageBlock, formPomodoroState } from "../common/functions";

let currentState: boolean = false; // stop or start

class PomodoroStateImpl implements PomodoroState {
  timeDOM: HTMLElement;
  currentTime: number;
  currentCycle: number;

  constructor() {
    this.currentCycle = 0;
    this.currentTime = 0;
    this.timeDOM = document.getElementById("mainTime")!;
  }
  resetCycle() {
    this.currentCycle = 0;
  }
  increaseCycle() {
    this.currentCycle++;
  }
  getCurrentCycle() {
    return this.currentCycle;
  }

  getCurrentTime() {
    return this.currentTime;
  }
}

const socket = new WebSocket("ws://" + window.location.host + "/api/v1/");

socket.addEventListener("open", (event) => {
  console.log("Opened it!");

  // socket.send();
});
socket.addEventListener("close", (event) => {
  console.log(event.reason);
});

socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
});
