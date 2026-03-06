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
    deadline: '2026-03-15',
    priority: 'high',
    category: 'academic',
    roadmapId: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Read chapter 2 of physics',
    completed: false,
    deadline: '2026-03-20',
    priority: 'medium',
    category: 'study',
    roadmapId: null,
    createdAt: new Date().toISOString()
  }
];

const opportunities = [
  {
    id: 1,
    title: 'MIT Summer Research Program',
    type: 'research',
    field: 'STEM',
    description: 'Participate in cutting-edge research over the summer',
    deadline: '2026-04-01',
    link: 'https://example.com/mit-research'
  },
  {
    id: 2,
    title: 'Goldman Sachs Internship',
    type: 'internship',
    field: 'Finance',
    description: 'Investment banking and trading internship',
    deadline: '2026-03-31',
    link: 'https://example.com/gs-internship'
  },
  {
    id: 3,
    title: 'International Science Olympiad',
    type: 'competition',
    field: 'STEM',
    description: 'Global STEM competition for high school students',
    deadline: '2026-05-15',
    link: 'https://example.com/iso'
  },
  {
    id: 4,
    title: 'Debate Championship National Circuit',
    type: 'competition',
    field: 'Debate',
    description: 'Compete in the national debate circuit',
    deadline: '2026-06-01',
    link: 'https://example.com/debate-nationals'
  },
  {
    id: 5,
    title: 'Harvard Community Impact Fellowship',
    type: 'internship',
    field: 'Social Impact',
    description: 'Work on impactful projects in your community',
    deadline: '2026-04-15',
    link: 'https://example.com/harvard-fellowship'
  }
];

const roadmaps = [
  {
    id: 1,
    name: 'Path to MIT',
    targetSchool: 'MIT',
    description: 'Strategic milestones to strengthen your MIT application',
    milestones: [
      { id: 1, title: 'Maintain 4.0 GPA', targetDate: '2026-06-01', completed: false },
      { id: 2, title: 'Complete Research Project', targetDate: '2026-07-01', completed: false },
      { id: 3, title: 'Win Science Competition', targetDate: '2026-08-15', completed: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Path to Stanford',
    targetSchool: 'Stanford',
    description: 'Curated steps for a strong Stanford application',
    milestones: [
      { id: 1, title: 'Build Coding Portfolio', targetDate: '2026-07-01', completed: false },
      { id: 2, title: 'Internship at Tech Company', targetDate: '2026-08-01', completed: false }
    ],
    createdAt: new Date().toISOString()
  }
];

let nextTaskId = tasks.length + 1;
let nextOpportunityId = opportunities.length + 1;
let nextRoadmapId = roadmaps.length + 1;

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title, deadline, priority, category, roadmapId } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required.' });
  }

  const newTask = {
    id: nextTaskId,
    title: title.trim(),
    completed: false,
    deadline: deadline || null,
    priority: priority || 'medium',
    category: category || 'general',
    roadmapId: roadmapId || null,
    createdAt: new Date().toISOString()
  };

  nextTaskId += 1;
  tasks.push(newTask);

  return res.status(201).json(newTask);
});

app.patch('/tasks/:id', (req, res) => {
  const taskId = Number.parseInt(req.params.id, 10);
  const { completed, deadline, priority, category } = req.body;

  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ error: 'Task id must be an integer.' });
  }

  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  if (typeof completed === 'boolean') {
    task.completed = completed;
  }
  if (deadline) {
    task.deadline = deadline;
  }
  if (priority) {
    task.priority = priority;
  }
  if (category) {
    task.category = category;
  }

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
  const completedCount = tasks.filter((t) => t.completed).length;
  const suggestions = [
    'Review math notes for 30 mins',
    'Complete 5 practice problems',
    'Start MIT Summer Research Program—applications open soon!',
    'Apply to Goldman Sachs Internship before deadline',
    'Join the International Science Olympiad',
    'Work on your roadmap milestones to strengthen your application',
    'Build a coding portfolio for tech internships',
    'Practice for upcoming competitions'
  ];

  const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
  return res.json({
    suggestion,
    tasksCompleted: completedCount,
    source: 'ai-recommendations'
  });
});

app.get('/opportunities', (req, res) => {
  const { type, field, search } = req.query;
  let filtered = opportunities;

  if (type) {
    filtered = filtered.filter((opp) => opp.type === type);
  }

  if (field) {
    filtered = filtered.filter((opp) => opp.field === field);
  }

  if (search) {
    const lowerSearch = search.toLowerCase();
    filtered = filtered.filter(
      (opp) =>
        opp.title.toLowerCase().includes(lowerSearch) ||
        opp.description.toLowerCase().includes(lowerSearch)
    );
  }

  return res.json(filtered);
});

app.get('/roadmaps', (req, res) => {
  return res.json(roadmaps);
});

app.post('/roadmaps', (req, res) => {
  const { name, targetSchool, description, milestones } = req.body;

  if (!name || !targetSchool) {
    return res.status(400).json({ error: 'name and targetSchool are required.' });
  }

  const newRoadmap = {
    id: nextRoadmapId,
    name,
    targetSchool,
    description: description || '',
    milestones: milestones || [],
    createdAt: new Date().toISOString()
  };

  nextRoadmapId += 1;
  roadmaps.push(newRoadmap);

  return res.status(201).json(newRoadmap);
});

app.patch('/roadmaps/:id/milestones/:milestoneId', (req, res) => {
  const roadmapId = Number.parseInt(req.params.id, 10);
  const milestoneId = Number.parseInt(req.params.milestoneId, 10);
  const { completed } = req.body;

  const roadmap = roadmaps.find((r) => r.id === roadmapId);
  if (!roadmap) {
    return res.status(404).json({ error: 'Roadmap not found.' });
  }

  const milestone = roadmap.milestones.find((m) => m.id === milestoneId);
  if (!milestone) {
    return res.status(404).json({ error: 'Milestone not found.' });
  }

  milestone.completed = typeof completed === 'boolean' ? completed : !milestone.completed;

  return res.json(roadmap);
});

app.get('/', (req, res) => {
  res.json({ message: 'NexDex backend is running.' });
});

app.listen(PORT, () => {
  console.log(`NexDex backend running on http://localhost:${PORT}`);
});