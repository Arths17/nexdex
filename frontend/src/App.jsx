import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';

const api = axios.create({
  baseURL: API_BASE_URL
});

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const loadTasks = async () => {
    try {
      setError('');
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (requestError) {
      setError(`Could not load tasks. Is the backend running at ${API_BASE_URL}?`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (event) => {
    event.preventDefault();

    const title = newTaskTitle.trim();
    if (!title) {
      return;
    }

    try {
      setError('');
      const response = await api.post('/tasks', { title });
      setTasks((previousTasks) => [...previousTasks, response.data]);
      setNewTaskTitle('');
    } catch (requestError) {
      setError('Could not add task. Please try again.');
    }
  };

  const handleGetSuggestion = async () => {
    try {
      setError('');
      const response = await api.get('/suggest');
      setSuggestion(response.data.suggestion);
    } catch (requestError) {
      setError('Could not fetch suggestion.');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      setError('');
      const response = await api.patch(`/tasks/${task.id}`, {
        completed: !task.completed
      });

      setTasks((previousTasks) =>
        previousTasks.map((item) => (item.id === task.id ? response.data : item))
      );
    } catch (requestError) {
      setError('Could not update task status. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setError('');
      await api.delete(`/tasks/${taskId}`);
      setTasks((previousTasks) => previousTasks.filter((item) => item.id !== taskId));
    } catch (requestError) {
      setError('Could not delete task. Please try again.');
    }
  };

  return (
    <main className="page">
      <section className="card">
        <h1>NexDex Student Dashboard</h1>
        <p className="subtitle">Track your study tasks and stay consistent.</p>

        <form onSubmit={handleAddTask} className="task-form">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(event) => setNewTaskTitle(event.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>

        <div className="actions">
          <button type="button" onClick={handleGetSuggestion}>
            Get AI Suggestion
          </button>
          {suggestion && <p className="suggestion">Suggestion: {suggestion}</p>}
        </div>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={task.completed ? 'task-item completed' : 'task-item'}>
                <span>{task.title}</span>
                <div className="task-actions">
                  <button type="button" onClick={() => handleToggleComplete(task)}>
                    {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;