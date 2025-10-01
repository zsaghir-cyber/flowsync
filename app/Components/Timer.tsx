"use client";

import React from "react";
import { useState, useEffect, useRef, useContext } from "react";
import PlayButton from "./PlayButton";
import PauseButton from "./PauseButton";
import Break from "./Break";
import Pomodoro from "./Pomodoro";
import SettingsContext from "../../context/SettingContext";
import Setting from "./Setting";
import { Card } from "pixel-retroui";

function Timer() {
  // State variables
  const settingsInfo = useContext(SettingsContext)!;
  const [seconds, setSeconds] = useState(25);
  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState("pomodoro");
  const secondsRef = useRef(seconds);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [music, setMusic] = useState("None");
  const bellRef = useRef<HTMLAudioElement>(null);

  function tick() {
    secondsRef.current--;
    setSeconds(secondsRef.current);
  }
  function handleMusicChange() {
    if (
      audioRef.current &&
      settingsInfo.music &&
      settingsInfo.music !== "None"
    ) {
      audioRef.current.src = settingsInfo.music;
      audioRef.current.loop = true;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((e) => console.warn("Audio play failed:", e));
    }
  }
  useEffect(() => {
    function switchMode() {
      const newMode = modeRef.current === "pomodoro" ? "break" : "pomodoro";
      const newSeconds =
        newMode === "pomodoro"
          ? settingsInfo.pomodoroTime * 60 // Convert minutes to seconds
          : settingsInfo.breakTime * 60; // Convert minutes to seconds

      isPausedRef.current = true;
      setIsPaused(true);
      if (bellRef.current) {
        bellRef.current.currentTime = 0;
        bellRef.current
          .play()
          .catch((e) => console.warn("Bell play failed:", e));
      }

      setMode(newMode);

      modeRef.current = newMode;
      setSeconds(newSeconds);
      secondsRef.current = newSeconds;
    }
    if (modeRef.current === "pomodoro") {
      secondsRef.current = settingsInfo.pomodoroTime * 60; // Convert minutes to seconds
    } else {
      secondsRef.current = settingsInfo.breakTime * 60; // Convert minutes to seconds
    }
    setSeconds(secondsRef.current);

    const interval = setInterval(() => {
      if (isPausedRef.current) return;

      if (secondsRef.current === 0) {
        return switchMode();
      }

      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [settingsInfo]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;

  return (
    <Card bg="#9CAFAA" className="p-4 items-center flex flex-col">
      <div className="flex flex-col items-center justify-center ">
        <audio ref={audioRef} preload="auto" className="hidden" />

        {/* Bell Sound Audio */}
        <audio
          ref={bellRef}
          src="/mixkit-notification-bell-592.wav"
          preload="auto"
          className="hidden"
        />

        <div className="text-center mb-4"></div>
        <div className="flex space-x-4 mt-4 ">
          <Break
            onClick={() => {
              setIsPaused(true);
              isPausedRef.current = true;
              setMode("break");
              modeRef.current = "break";
              setSeconds(settingsInfo.breakTime * 60);
              secondsRef.current = settingsInfo.breakTime * 60;
            }}
          />
          <Pomodoro
            onClick={() => {
              setIsPaused(true);
              isPausedRef.current = true;
              setMode("pomodoro");
              modeRef.current = "pomodoro";
              setSeconds(settingsInfo.pomodoroTime * 60);
              secondsRef.current = settingsInfo.pomodoroTime * 60;
            }}
          />
        </div>
        <p className=" text-9xl font-stretch-200% font-extrabold   ">
          {formattedTime}
        </p>
        {isPaused ? (
          <PlayButton
            onClick={() => {
              setIsPaused(false);
              isPausedRef.current = false;
              handleMusicChange();
            }}
          />
        ) : (
          <>
            <PauseButton
              onClick={() => {
                setIsPaused(true);
                isPausedRef.current = true;
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0; // stop and reset
                }
              }}
            />
          </>
        )}
      </div>
    </Card>
  );
}

export default Timer;
