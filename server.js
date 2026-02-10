const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const FILE = "tasks.json";
const readTasks = () => {
  try {
    const data = fs.readFileSync(FILE, "utf8");
    return data.trim() ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const writeTasks = (data) => fs.writeFileSync(FILE, JSON.stringify(data, null, 2));


app.post("/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    status: "not done"
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.json({ message: "Task added", task: newTask });
});


app.put("/tasks/:id", (req, res) => {
  let tasks = readTasks();
  const id = Number(req.params.id);

  tasks = tasks.map(task =>
    task.id === id ? { ...task, title: req.body.title } : task
  );

  writeTasks(tasks);
  res.json({ message: "Task updated" });
});


app.delete("/tasks/:id", (req, res) => {
  let tasks = readTasks();
  const id = Number(req.params.id);

  tasks = tasks.filter(task => task.id !== id);
  writeTasks(tasks);
  res.json({ message: "Task deleted" });
});


app.patch("/tasks/:id/in-progress", (req, res) => {
  let tasks = readTasks();
  const id = Number(req.params.id);

  tasks = tasks.map(task =>
    task.id === id ? { ...task, status: "in progress" } : task
  );

  writeTasks(tasks);
  res.json({ message: "Task marked in progress" });
});


app.patch("/tasks/:id/done", (req, res) => {
  let tasks = readTasks();
  const id = Number(req.params.id);

  tasks = tasks.map(task =>
    task.id === id ? { ...task, status: "done" } : task
  );

  writeTasks(tasks);
  res.json({ message: "Task marked done" });
});


app.get("/tasks", (req, res) => {
  res.json(readTasks());
});


app.get("/tasks/done", (req, res) => {
  const tasks = readTasks().filter(t => t.status === "done");
  res.json(tasks);
});


app.get("/tasks/not-done", (req, res) => {
  const tasks = readTasks().filter(t => t.status === "not done");
  res.json(tasks);
});


app.get("/tasks/in-progress", (req, res) => {
  const tasks = readTasks().filter(t => t.status === "in progress");
  res.json(tasks);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
