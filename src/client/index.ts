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
  currentEvent: PomodoroEvent;
  PomoState(currentEvent: PomodoroEvent) {
    this.currentEvent = currentEvent;
  }
}

const socket = new WebSocket("ws://" + window.location.host + "/api/v1/");

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
  currentEvent = msgBlock.event;
});
