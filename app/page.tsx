"use client";
import React, { useState } from "react";
import SettingsContext from "../context/SettingContext";
// REMOVED: Timer import (You are using TimerWrapper instead)
import Tasks from "./Components/Tasks";
import UserProfile from "./Components/user/UserProfile";
import Setting from "./Components/Setting";
import UserTasks from "./Components/user/userTasks";
import { useAuth } from "@/context/AuthContext";
import TimerWrapper from "./Timer/page";

export default function Page() {
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [music, setMusic] = useState("None");
  // REMOVED: userinfo and setuserinfo (defined but never used)
  const { user } = useAuth();

  return (
    <SettingsContext.Provider
      value={{
        pomodoroTime,
        setPomodoroTime,
        breakTime,
        setBreakTime,
        music,
        setMusic,
      }}
    >
      {/* Navbar */}
      <header className="w-full px-6 py-4 flex items-center justify-end bg-[#D6DAC8] backdrop-blur-md sticky top-0 z-50">
        <div className="flex gap-4 items-center">
          <UserProfile />
          <Setting />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-10 gap-20 box-timer">
        <TimerWrapper />
        {user ? <UserTasks /> : <Tasks />}
      </div>
    </SettingsContext.Provider>
  );
}
