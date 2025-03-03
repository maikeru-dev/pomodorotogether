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

export function formMessageBlock(
  state: PomodoroState,
  event: PomodoroEvent,
  config: PomodoroConfig,
) {
  return { state: state, event: event, config: config };
}
