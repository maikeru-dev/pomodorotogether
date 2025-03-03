let hamburgerDOM;
let closeBurgerDOM;
let settingsDOM;
let mainPageDOM;
let currentSettings;

const socket = new WebSocket("ws://" + window.location.host + "/api/v1/");

function formPomodoroState(currentTime, currentCycle) {
  return {
    currentTime: currentTime,
    currentCycle: currentCycle,
  };
}

function formMessageBlock(secret, state, event, config) {
  return { secret: secret, state: state, event: event, config: config };
}

function getConfig() {}

function generateSocketMessage(event) {
  let state = formPomodoroState(getCurrentTime(), getCurrentCycle());
  let config = getConfig();

  let messageBlock = formMessageBlock(secret, state, event, config);

  return JSON.stringify(messageBlock);
}

socket.addEventListener("open", (event) => {
  console.log("Opened it!");
  socket.send(formMessageBlock("YOOOO", {}, {}));
});
socket.addEventListener("error", (event) => {
  console.error(event.error);
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
