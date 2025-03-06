import {
  MessageBlock,
  PomodoroEvent,
  PomodoroConfig,
  PomodoroState,
  PomoState,
} from "../common/interfaces.js";
import * as functions from "../common/functions.js";

const currentState: PomoState = new PomoState();
let socket: WebSocket;

function addListeners(socket: WebSocket) {
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
  socket = new WebSocket("ws://" + window.location.host + "/api/v1/");
  addListeners(socket);
}
document.body.addEventListener("DOMContentLoaded", () => init());
