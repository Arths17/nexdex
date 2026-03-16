import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { FaArrowDown, FaEquals, FaArrowUp } from "react-icons/fa";
function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priority, setPriority] = useState('low')
  const [deadline,setDeadline] = useState('')



  // priority level icons


  const loadTasks = async () => {
    try {
      setError('');
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (requestError) {
      setError(`Could not load tasks. Is the backend running?`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (!task.deadline) return task;

          const now = new Date();
          const deadlineDate = new Date(task.deadline);
          const diff = deadlineDate - now;

          if (diff <= 0) {
            return { ...task, countdown: 'Expired' };
          }

          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);

          return {
            ...task,
            countdown: `${days}d ${hours}h ${minutes}m ${seconds}s`,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAddTask = async (event) => {
    event.preventDefault();

    const title = newTaskTitle.trim();
    if (!title) {
      return;
    }

    try {
      setError('');
      const response = await api.post('/tasks', { title, priority, deadline });
      setTasks((previousTasks) => [...previousTasks, response.data]);
      setNewTaskTitle('');
    } catch (requestError) {
      setError('Could not add task. Please try again.');
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
      setError('Cfould not delete task. Please try again.');
    }
  };

  return (
    <section className="card">
      <h1>Dashboard</h1>
      <p className="subtitle">Track your study tasks and stay consistent.</p>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(event) => setNewTaskTitle(event.target.value)}
        />
        <input 
        type="date"
        value={deadline}
        onChange={(e)=> setDeadline(e.target.value) }
         />
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <div className='task-section'>  
            <ul className='task-list'>

            <li
              key={task.id}
              className={`task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`}
            >
              <div className="task-info">
                <span>{task.title}</span>
                <div className='task-meta'>

                <span className='deadline'>Deadline: {task.deadline}</span>
                <span className={`priority-badge priority-badge ${task.priority}`}>{task.priority.toUpperCase()}</span>
                </div>



              </div>
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
            </ul>
            </div>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Dashboard;
