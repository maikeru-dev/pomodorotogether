var PomodoroEvent;
(function (PomodoroEvent) {
    PomodoroEvent[PomodoroEvent["STOPPED"] = 0] = "STOPPED";
    PomodoroEvent[PomodoroEvent["STARTED"] = 1] = "STARTED";
    PomodoroEvent[PomodoroEvent["LONG_STOP"] = 2] = "LONG_STOP";
    PomodoroEvent[PomodoroEvent["SYNC_CONFIG"] = 3] = "SYNC_CONFIG";
    PomodoroEvent[PomodoroEvent["AWK_SYNC"] = 4] = "AWK_SYNC";
    PomodoroEvent[PomodoroEvent["CONNECT"] = 5] = "CONNECT";
})(PomodoroEvent || (PomodoroEvent = {}));
class PomoState {
    currentEvent = PomodoroEvent.STOPPED;
    listeners = [];
    constructor() { }
    registerListener(handler) {
        this.listeners.push(handler);
    }
    broadcastUpdate() {
        this.listeners.forEach(() => {
            return this.currentEvent;
        });
    }
    setCurrentEvent(newEvent) {
        this.currentEvent = newEvent;
        this.broadcastUpdate();
    }
    genMsgBlock() {
        return { event: this.currentEvent };
    }
}

const currentState = new PomoState();
let socket;
function addListeners(socket) {
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
        let msgBlock = JSON.parse(event.data);
        currentState.setCurrentEvent(msgBlock.event);
    });
}
if (document.readyState !== "loading") {
    init();
}
else {
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
//# sourceMappingURL=bundle.js.map
