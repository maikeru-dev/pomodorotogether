import {
  MessageBlock,
  PomoEvent,
  PomodoroConfig,
} from "../common/interfaces.js";
import * as functions from "../common/functions.js";
import { StyledPomoState } from "./styling.js";

let currentState: StyledPomoState;
let socket: WebSocket;

function addListeners(socket: WebSocket, state: StyledPomoState) {
  let currentState: StyledPomoState = state;
  let handler: Function;

  socket.addEventListener("open", (event) => {
    handler = state.registerListener(sendMessage);
    console.log("Opened it!");
    let msgBlock = currentState.genMsgBlock();
    currentState.silentUpdate(PomoEvent.STOPPED);
    socket.send(JSON.stringify(msgBlock));
  });
  socket.addEventListener("close", (event) => {
    console.log(event.reason);
  });

  socket.addEventListener("message", (event) => {
    let msgBlock: MessageBlock = JSON.parse(event.data);
    currentState.excludedListenerUpdate(msgBlock.event, handler);
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

function sendMessage(state: StyledPomoState): void {
  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }

  socket.send(JSON.stringify(state.genMsgBlock()));
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
