"use client";
import React, { useState, useRef, useEffect, use } from "react";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "pixel-retroui";
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
import { useAuth } from "@/context/AuthContext";
import { Button, Input } from "pixel-retroui";

const Tasks = () => {
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
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );
    setTaskList(updatedTaskList);
  };

  return (
    <Box className="flex flex-col items-center mt-4">
      <div className="flex items-center gap-2">
        <Input
          bg="white"
          textColor="black"
          borderColor="black"
          placeholder="Enter a task..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />

        <Button
          bg="#D6DAC8"
          textColor="#30210b"
          borderColor="#30210b"
          shadow="#30210b"
          className="transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
          onClick={addTask}
        >
          Add
        </Button>

        <DropdownMenu
          bg="#D6DAC8"
          textColor="black"
          borderColor="black"
          shadowColor="#30210b"
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
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-black"
                    }`}
                  >
                    • {task.title}
                  </span>
                  <div className="flex gap-2">
                    <IconButton
                      onClick={() => completedTask(task.id)}
                      size="small"
                      sx={{ color: "white" }}
                    >
                      <CheckCircleOutlineIcon
                        fontSize="small"
                        sx={{
                          color: task.completed ? "lightgreen" : "gray",
                          cursor: "pointer",
                        }}
                      />
                    </IconButton>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <DeleteIcon
                        fontSize="small"
                        style={{ color: "#f87171" }}
                      />
                    </button>
                  </div>
                </div>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Box>
  );
};

export default Tasks;
