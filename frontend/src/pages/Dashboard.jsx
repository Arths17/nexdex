import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { FaArrowDown, FaEquals, FaArrowUp } from "react-icons/fa";
function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priority, setPriority] = useState('low')
  const [deadline, setDeadline] = useState('')
  const [category, setCategory] = useState('')
  const [taskUpdate, setTaskUpdate] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editedTitle, setEditedTitle] = useState('')
  const [selectedTasks, setSelectedTasks] = useState([])
  const [selectAll,setAllSelect] = useState(false)


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


  const handleAddTask = async (event) => {
    event.preventDefault();

    const title = newTaskTitle.trim();
    if (!title) {
      return;
    }

    try {
      setError('');
      const response = await api.post('/tasks', { title, priority, deadline, category });
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

  const handleTaskUpdate = async (task) => {
    setTaskUpdate(true)
    setEditingTaskId(task.id)
    setEditedTitle(task.title)
  }

  const handleSaveUpdate = async (taskId) => {
    try {
      setError('')
      const response = await api.patch(`/tasks/${taskId}`, {
        title: editedTitle
      })
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId ? response.data : task
        )
      )

    } catch (requestError) {
      setError('Could not update task status. Please try again.');

    }

  }

  const handleDeleteTask = async (taskId) => {
    try {
      setError('');
      await api.delete(`/tasks/${taskId}`);
      setTasks((previousTasks) => previousTasks.filter((item) => item.id !== taskId));
    } catch (requestError) {
      setError('Cfould not delete task. Please try again.');
    }
  };

  // handle selected tasks 

  const handleSelectedTasks = (taskId) => {

    setSelectedTasks((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter(task => task !== taskId)
      }
      else {
        return [...prev, taskId]
      }
    })

  }

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
          onChange={(e) => setDeadline(e.target.value)}
        />
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="study">Study</option>
          <option value="assignment">Assignment</option>
          <option value="academic">Academic</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {
        tasks.length > 0 && (
          <div className='bulk-actions-bar'>
            <div className='bulk-select'>

            <label>
              <input
                type="checkbox"
              />
              Select All
            </label>
            </div>

            <div className='bulk-buttons'>

            <button
            className='bulk-complete'
            >Complete</button>
            <button>Delete</button>
            </div>

          </div>

        )
      }

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
                    <input
                      type="checkbox"
                      onChange={() => handleSelectedTasks(task.id)} />

                    {
                      taskUpdate && task.id === editingTaskId ? (
                        <div className='task-info'>
                          <input type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                          />
                          <button
                            className='success'
                            onClick={() => handleSaveUpdate(task.id)}
                          >update</button>
                          <button className='danger'
                            onClick={() => setTaskUpdate(false)}
                          >
                            cancel</button>
                        </div>
                      ) : (
                        <>
                          <span>{task.title}</span>
                        </>
                      )

                    }
                    <div className='task-meta'>

                      <span className='deadline'>Deadline: {task.deadline}</span>

                      <span className={`category-badge ${task.category}`}>
                        {task.category?.toUpperCase()}
                      </span>

                      <span className={`priority-badge ${task.priority}`}>
                        {task.priority.toUpperCase()}
                      </span>

                    </div>


                  </div>
                  <div className="task-actions">
                    <button type="button" onClick={() => handleToggleComplete(task)}>
                      {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                    <button className='success'
                      onClick={() => handleTaskUpdate(task)}
                    >

                      update
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
