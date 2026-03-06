const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

const tasks = [
  {
    id: 1,
    title: 'Complete NexDex onboarding',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Read chapter 2 of physics',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

let nextTaskId = tasks.length + 1;

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required.' });
  }

  const newTask = {
    id: nextTaskId,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };

  nextTaskId += 1;
  tasks.push(newTask);

  return res.status(201).json(newTask);
});

app.patch('/tasks/:id', (req, res) => {
  const taskId = Number.parseInt(req.params.id, 10);
  const { completed } = req.body;

  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ error: 'Task id must be an integer.' });
  }

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'completed must be a boolean.' });
  }

  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  task.completed = completed;
  return res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ error: 'Task id must be an integer.' });
  }

  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  tasks.splice(taskIndex, 1);
  return res.status(204).send();
});

app.get('/suggest', (req, res) => {
  res.json({
    suggestion: 'Review math notes for 30 mins',
    source: 'ai-stub'
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'NexDex backend is running.' });
});

app.listen(PORT, () => {
  console.log(`NexDex backend running on http://localhost:${PORT}`);
});