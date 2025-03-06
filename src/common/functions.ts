import {
  MessageBlock,
  PomodoroEvent,
  PomodoroConfig,
  PomodoroState,
} from "../common/interfaces.js";

export function formPomodoroState(currentTime: number, currentCycle: number) {
  return {
    currentTime: currentTime,
    currentCycle: currentCycle,
  };
}

export function formMessageBlock(event: PomodoroEvent) {
  return { event: event };
}
