import React, { useEffect, useState } from 'react';
import { api } from '../api';

function RoadmapBuilder() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetSchool: '',
    description: ''
  });

  const loadRoadmaps = async () => {
    try {
      setError('');
      const response = await api.get('/roadmaps');
      setRoadmaps(response.data);
    } catch (requestError) {
      setError('Could not load roadmaps.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const handleCreateRoadmap = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.targetSchool) {
      setError('Name and target school are required.');
      return;
    }

    try {
      setError('');
      const response = await api.post('/roadmaps', formData);
      setRoadmaps((prev) => [...prev, response.data]);
      setFormData({ name: '', targetSchool: '', description: '' });
      setShowForm(false);
    } catch (requestError) {
      setError('Could not create roadmap.');
    }
  };

  const handleToggleMilestone = async (roadmapId, milestoneId, currentCompleted) => {
    try {
      setError('');
      const response = await api.patch(`/roadmaps/${roadmapId}/milestones/${milestoneId}`, {
        completed: !currentCompleted
      });

      setRoadmaps((prev) =>
        prev.map((rm) => (rm.id === roadmapId ? response.data : rm))
      );
    } catch (requestError) {
      setError('Could not update milestone.');
    }
  };

  return (
    <section className="card">
      <h1>Roadmap Builder</h1>
      <p className="subtitle">Plan your path to success with guided milestones.</p>

      {error && <p className="error">{error}</p>}

      {!showForm && (
        <button type="button" onClick={() => setShowForm(true)} className="primary-btn">
          + Create New Roadmap
        </button>
      )}

      {showForm && (
        <form onSubmit={handleCreateRoadmap} className="roadmap-form">
          <input
            type="text"
            placeholder="Roadmap name (e.g., Path to MIT)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Target school"
            value={formData.targetSchool}
            onChange={(e) => setFormData({ ...formData, targetSchool: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="form-actions">
            <button type="submit">Create Roadmap</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading roadmaps...</p>
      ) : (
        <div className="roadmaps-list">
          {roadmaps.length === 0 ? (
            <p>No roadmaps yet. Create one to get started!</p>
          ) : (
            roadmaps.map((roadmap) => (
              <div key={roadmap.id} className="roadmap-card">
                <div className="roadmap-header">
                  <h3>{roadmap.name}</h3>
                  <span className="target-school">→ {roadmap.targetSchool}</span>
                </div>
                {roadmap.description && <p className="roadmap-desc">{roadmap.description}</p>}

                <div className="milestones">
                  <h4>Milestones</h4>
                  {roadmap.milestones && roadmap.milestones.length > 0 ? (
                    <ul className="milestone-list">
                      {roadmap.milestones.map((milestone) => (
                        <li
                          key={milestone.id}
                          className={`milestone ${milestone.completed ? 'completed' : ''}`}
                        >
                          <button
                            type="button"
                            className="milestone-checkbox"
                            onClick={() =>
                              handleToggleMilestone(roadmap.id, milestone.id, milestone.completed)
                            }
                          >
                            {milestone.completed ? '✓' : '○'}
                          </button>
                          <span className="milestone-text">{milestone.title}</span>
                          {milestone.targetDate && (
                            <span className="milestone-date">
                              📅 {new Date(milestone.targetDate).toLocaleDateString()}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-milestones">No milestones added yet.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default RoadmapBuilder;
