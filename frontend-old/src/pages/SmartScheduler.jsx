import React, { useEffect, useState } from 'react';
import { api } from '../api';

function SmartScheduler() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  const loadTasks = async () => {
    try {
      setError('');
      const response = await api.get('/tasks');
      // Sort by deadline
      const sorted = response.data.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
      setTasks(sorted);
    } catch (requestError) {
      setError('Could not load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleUpdateTask = async (taskId, updates) => {
    try {
      setError('');
      const response = await api.patch(`/tasks/${taskId}`, updates);
      setTasks((previousTasks) =>
        previousTasks.map((item) => (item.id === taskId ? response.data : item))
      );
    } catch (requestError) {
      setError('Could not update task.');
    }
  };

  const filteredTasks = filterPriority === 'all' 
    ? tasks 
    : tasks.filter((t) => t.priority === filterPriority);

  const upcomingTasks = filteredTasks.filter((t) => !t.completed && t.deadline);
  const otherTasks = filteredTasks.filter((t) => !t.completed && !t.deadline);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  return (
    <section className="card">
      <h1>Smart Scheduler</h1>
      <p className="subtitle">Manage deadlines, priorities, and tasks.</p>

      <div className="filter-section">
        <label>Filter by Priority:</label>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="scheduler-sections">
          {upcomingTasks.length > 0 && (
            <div className="task-section">
              <h3>Upcoming Deadlines</h3>
              <ul className="task-list">
                {upcomingTasks.map((task) => (
                  <li key={task.id} className={`task-item priority-${task.priority}`}>
                    <div className="task-info">
                      <span>{task.title}</span>
                      <div className="task-meta">
                        {task.deadline && (
                          <span className="deadline">📅 {new Date(task.deadline).toLocaleDateString()}</span>
                        )}
                        <span className={`priority-badge ${task.priority}`}>
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdateTask(task.id, { completed: true })}
                      className="sm-btn"
                    >
                      ✓
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {otherTasks.length > 0 && (
            <div className="task-section">
              <h3>No Deadline Set</h3>
              <ul className="task-list">
                {otherTasks.map((task) => (
                  <li key={task.id} className={`task-item priority-${task.priority}`}>
                    <span>{task.title}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateTask(task.id, { completed: true })}
                      className="sm-btn"
                    >
                      ✓
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div className="task-section">
              <h3>Completed</h3>
              <ul className="task-list">
                {completedTasks.map((task) => (
                  <li key={task.id} className="task-item completed">
                    <span>{task.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default SmartScheduler;
