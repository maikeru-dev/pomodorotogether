import {
  MessageBlock,
  PomoEvent,
  PomodoroConfig,
  PomodoroState,
  PomoState,
} from "../common/interfaces.js";
import * as functions from "../common/functions.js";
import { StyledPomoState } from "./styling.js";

let currentState: PomoState;
let socket: WebSocket;

function addListeners(socket: WebSocket, state: PomoState) {
  let currentState: PomoState = state;

  socket.addEventListener("open", (event) => {
    console.log("Opened it!");
    let msgBlock = currentState.genMsgBlock();
    console.log(JSON.stringify(msgBlock));
    socket.send(JSON.stringify(msgBlock));
  });
  socket.addEventListener("close", (event) => {
    console.log(event.reason);
  });

  socket.addEventListener("message", (event) => {
    let msgBlock: MessageBlock = JSON.parse(event.data);
    currentState.setCurrentEvent(msgBlock.event);
    console.log("Recieved", msgBlock);
  });
}

if (document.readyState !== "loading") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    init();
  });
}

function init() {
  console.log("Running init!");
  let currentCode = window.location.pathname.slice(1);
  currentState = new StyledPomoState(currentCode);
  if (currentCode != "") {
    socket = new WebSocket("ws://" + window.location.host + "/api/v1/");
    addListeners(socket, currentState);
  }
}
document.body.addEventListener("DOMContentLoaded", () => init());
