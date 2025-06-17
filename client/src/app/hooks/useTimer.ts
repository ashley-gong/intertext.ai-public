import { useState, useEffect } from "react";

type TimerState = {
  single: number;
  dual: number;
  full: number;
  query: number;
};

type TimerHook = {
  timers: TimerState;
  isTimerRunning: boolean;
  isManuallyStarted: boolean;
  startTimer: (tab: string) => void;
  stopTimer: () => void;
  resetTimers: () => void;
  handleMouseEnter: (selectedView: string) => void;
  handleMouseLeave: () => void;
};

export const useTimer = (): TimerHook => {
  const [timers, setTimers] = useState<TimerState>({
    single: 0,
    dual: 0,
    full: 0,
    query: 0,
  });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [isManuallyStarted, setIsManuallyStarted] = useState(false);

  const startTimer = (tab: string) => {
    const id = setInterval(() => {
      setTimers((prevTimers) => ({
        ...prevTimers,
        [tab]: prevTimers[tab as keyof TimerState] + 1,
      }));
    }, 1000);
    setIntervalId(id as unknown as number);
    setIsTimerRunning(true);
    setIsManuallyStarted(true);
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsTimerRunning(false);
    setIsManuallyStarted(false);
  };

  const resetTimers = () => {
    stopTimer();
    setTimers({ single: 0, dual: 0, full: 0, query: 0 });
  };

  const handleMouseEnter = (selectedView: string) => {
    if (isManuallyStarted && !isTimerRunning) {
      const id = setInterval(() => {
        setTimers((prevTimers) => ({
          ...prevTimers,
          [selectedView]: prevTimers[selectedView as keyof TimerState] + 1,
        }));
      }, 1000);
      setIntervalId(id as unknown as number);
      setIsTimerRunning(true);
    }
  };

  const handleMouseLeave = () => {
    if (isManuallyStarted && isTimerRunning) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsTimerRunning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return {
    timers,
    isTimerRunning,
    isManuallyStarted,
    startTimer,
    stopTimer,
    resetTimers,
    handleMouseEnter,
    handleMouseLeave,
  };
};
