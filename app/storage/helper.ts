import React, { useState, useRef, useEffect, use } from "react";
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  onSnapshot,
  collection,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
type Task = {
  id: string;
  title: string;
  completed: boolean;
};
const {user} = useAuth();
export const getTasks = async() => {
    if (user) {
        const taskref = collection(db, "users", user.uid, "tasklist");
            const unsub = onSnapshot(taskref, (querySnapshot) => {
              const tasks: Task[] = [];
              querySnapshot.forEach((doc) => {
                tasks.push({ id: doc.id, ...(doc.data() as Omit<Task, "id">) });
              });
            });
           unsub();
           return null;
    }
    else {
        return JSON.parse(localStorage.getItem("tasks") || "[]");
    }
};

export const addTask = async (task: Task) => {
  if (user) {
   const taskRef = collection(db, "users", user.uid, "tasklist");
         await addDoc(taskRef, { title, completed: false });
         taskInputRef.current.value = "";
  } else {
    const stored = JSON.parse(localStorage.getItem("tasks") || "[]");
    stored.push(task);
    localStorage.setItem("tasks", JSON.stringify(stored));
  }
};