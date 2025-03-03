import {
  MessageBlock,
  PomodoroEvent,
  PomodoroConfig,
  PomodoroState,
} from "../common/interfaces";
import { formMessageBlock, formPomodoroState } from "../common/functions";

let hamburgerDOM: HTMLElement;
let closeBurgerDOM: HTMLElement;
let settingsDOM: HTMLElement;
let mainPageDOM: HTMLElement;
let currentSettings: HTMLElement;

let currentState: PomodoroState = {};

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
function getConfig() {}

function generateSocketMessage(event: PomodoroEvent): string {
  let state = formPomodoroState(getCurrentTime(), getCurrentCycle());
  let config = getConfig();

  let messageBlock = formMessageBlock(state, event, config);

  return JSON.stringify(messageBlock);
}

socket.addEventListener("open", (event) => {
  console.log("Opened it!");

  socket.send(formMessageBlock());
});
socket.addEventListener("close", (event) => {
  console.log(event.reason);
});

socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
});

function isSettingsCustom() {
  return false;
}

function writeSettings() {
  return;
}

function saveSettings() {
  return;
}
function settingsDeepEqual() {
  return true;
}
function loadSettingsFromLocalStorage() {
  return;
}

function saveSettingsToLocalStorage() {
  return;
}

function openSettings() {
  // Load settings
  if (!isSettingsCustom()) {
    // write to DOM
    let newSettings = loadSettingsFromLocalStorage();
    if (newSettings) currentSettings = newSettings;
    writeSettings(currentSettings);
  }

  // Update styles
  hamburgerDOM.style.display = "none";
  closeBurgerDOM.style.display = "block";

  mainPageDOM.style.display = "none";
  settingsDOM.style.display = "flex";
}
function closeSettings() {
  let newSettings;
  // save from DOM
  saveSettings(newSettings);
  if (!settingsDeepEqual(currentSettings, newSettings)) {
    localStorage.setItem("customSettings", "somevalue");
    currentSettings = newSettings;
    saveSettingsToLocalStorage(currentSettings);
    applySettings(newSettings);
  }

  closeBurgerDOM.style.display = "none";
  hamburgerDOM.style.display = "block";

  mainPageDOM.style.display = "block";
  settingsDOM.style.display = "none";
}

function testConn() {}

function init() {
  closeBurgerDOM = document.getElementById("closeBurger");
  hamburgerDOM = document.getElementById("openHamburger");
  settingsDOM = document.getElementById("settings");
  mainPageDOM = document.getElementById("mainPage");
}

document.addEventListener("DOMContentLoaded", init);
function getCurrentTime(): any {
  throw new Error("Function not implemented.");
}
function getCurrentCycle(): any {
  throw new Error("Function not implemented.");
}
