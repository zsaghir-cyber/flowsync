import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "pixel-retroui";
import React, { useState } from "react";
import {
  Box,
  Popper,
  Paper,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Button, Input } from "pixel-retroui";
const page = () => {
  const { user } = useAuth();
  const [taskInput, setTaskInput] = useState("");

  const [taskList, setTaskList] = useState<
    { completed: boolean; id: number; title: string }[]
  >([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "task-popper" : undefined;

  const addTask = () => {
    if (taskInput.trim() !== "") {
      const newTask = {
        completed: false,
        id: Date.now(),
        title: taskInput,
      };
      setTaskList((prev) => [...prev, newTask]);
      setTaskInput("");
    }
  };
  const deleteTask = (taskId: number) => {
    const newList = taskList.filter((task) => task.id !== taskId);
    setTaskList(newList);
  };
  const completedTask = (taskId: number) => {
    const updatedTaskList = taskList.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTaskList(updatedTaskList);
  };
  return (
    <div>
      {/* Dropdown for tasks */}
      <DropdownMenu
        bg="#D6A99D"
        textColor="black"
        borderColor="black"
        shadowColor="#c381b5"
      >
        <DropdownMenuTrigger>Tasks ({taskList.length})</DropdownMenuTrigger>

        <DropdownMenuContent className="w-72 p-2 space-y-2">
          {taskList.length === 0 ? (
            <p className="text-sm italic text-gray-600">No tasks yet</p>
          ) : (
            taskList.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center bg-white/40 rounded px-2 py-1"
              >
                <span
                  className={`${
                    task.completed ? "line-through text-gray-500" : "text-black"
                  }`}
                >
                  • {task.title}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleToggle}
                    className="p-1 hover:scale-110 transition"
                  >
                    <CheckCircleOutlineIcon
                      fontSize="small"
                      style={{
                        color: task.completed ? "lightgreen" : "gray",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 hover:scale-110 transition"
                  >
                    <DeleteIcon fontSize="small" style={{ color: "#f87171" }} />
                  </button>
                </div>
              </div>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default page;
