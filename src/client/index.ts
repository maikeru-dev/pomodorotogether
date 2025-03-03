import {
  MessageBlock,
  PomodoroEvent,
  PomodoroConfig,
  PomodoroState,
} from "../common/interfaces";
import {
  formMessageBlock as newMsgBlock,
  formPomodoroState,
} from "../common/functions";

class PomoState {
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
}

const currentState: PomoState = new PomoState();
let socket: WebSocket;

function addListeners(socket: WebSocket) {
  socket.addEventListener("open", (event) => {
    console.log("Opened it!");
    let msgBlock = newMsgBlock(PomodoroEvent.STOPPED);

    socket.send(JSON.stringify(msgBlock));
  });
  socket.addEventListener("close", (event) => {
    console.log(event.reason);
  });

  socket.addEventListener("message", (event) => {
    let msgBlock: MessageBlock = JSON.parse(event.data);
    currentState.setCurrentEvent(msgBlock.event);
  });
}

function init() {
  socket = new WebSocket("ws://" + window.location.host + "/api/v1/");
  addListeners(socket);
}
document.body.addEventListener("DOMContentLoaded", () => init());
