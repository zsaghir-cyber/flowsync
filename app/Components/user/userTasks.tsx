"use client";
import React, { useState, useEffect } from "react"; // Removed useRef, use
import { Box } from "@mui/material"; // Removed Typography, IconButton, TextField
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  doc,
  collection,
  deleteDoc,
  updateDoc,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  Input,
  Button,
} from "pixel-retroui";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const UserTasks = () => {
  const { user } = useAuth();
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");

  // REMOVED: anchorEl, handleToggle, open, and id
  // These were for MUI Popper, but you are using Retroui Dropdown.

  useEffect(() => {
    if (!user) return;
    const taskref = collection(db, "users", user.uid, "tasklist");
    const unsub = onSnapshot(taskref, (querySnapshot) => {
      const tasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...(doc.data() as Omit<Task, "id">) });
      });
      setTaskList(tasks);
    });
    return () => unsub();
  }, [user]);

  const addTask = async () => {
    if (taskInput && taskInput.trim() !== "") {
      const title = taskInput;
      if (!user) return;
      const taskRef = collection(db, "users", user.uid, "tasklist");
      await addDoc(taskRef, { title, completed: false });
      setTaskInput("");
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    const taskRef = doc(db, "users", user.uid, "tasklist", id);
    await deleteDoc(taskRef);
  };

  const completedTask = async (id: string, completed: boolean) => {
    if (!user) return;
    const taskRef = doc(db, "users", user.uid, "tasklist", id);
    await updateDoc(taskRef, { completed });
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
                    <button
                      onClick={() => completedTask(task.id, !task.completed)}
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

export default UserTasks;
