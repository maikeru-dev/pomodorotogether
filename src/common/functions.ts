import {
  MessageBlock,
  PomodoroEvent,
  PomodoroConfig,
  PomodoroState,
} from "../common/interfaces";

export function formPomodoroState(currentTime: number, currentCycle: number) {
  return {
    currentTime: currentTime,
    currentCycle: currentCycle,
  };
}

export function formMessageBlock(event: PomodoroEvent) {
  return { event: event };
}
