import {
  addDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";
type Task = {
  id: string;
  title: string;
  completed: boolean;
};


export const getTasks = async (user: User | null) => {
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
    } else {
        return JSON.parse(typeof window !== "undefined" ? localStorage.getItem("tasks") || "[]" : "[]");
    }
};

export const addTask = async (task: Task, user: User | null) => {
  if (user) {
    const taskRef = collection(db, "users", user.uid, "tasklist");
    await addDoc(taskRef, { title: task.title, completed: task.completed });
  } else {
    const stored = JSON.parse(localStorage.getItem("tasks") || "[]");
    stored.push(task);
    localStorage.setItem("tasks", JSON.stringify(stored));
  }
};