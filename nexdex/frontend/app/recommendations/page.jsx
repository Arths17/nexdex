'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

export default function RecommendationsHub() {
  const [suggestion, setSuggestion] = useState('');
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetSuggestion = async () => {
    setLoading(true);
    try {
      setError('');
      const response = await api.get('/suggest');
      setSuggestion(response.data.suggestion);
      setTasksCompleted(response.data.tasksCompleted);
    } catch (requestError) {
      setError('Could not fetch AI suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h1>AI Recommendations Hub</h1>
      <p className="subtitle">Get smart suggestions powered by your progress.</p>

      <div className="recommendations-section">
        <p>Get personalized recommendations based on your task completion and academic profile.</p>

        <button type="button" onClick={handleGetSuggestion} disabled={loading} className="primary-btn">
          {loading ? 'Loading...' : 'Get AI Suggestion'}
        </button>

        {error && <p className="error">{error}</p>}

        {suggestion && (
          <div className="suggestion-box">
            <h3>Suggested for You</h3>
            <p className="large-text">{suggestion}</p>
            <p className="meta">
              {tasksCompleted > 0 && `You've completed ${tasksCompleted} tasks so far.`}
            </p>
          </div>
        )}
      </div>

      <div className="recommendations-info">
        <h3>This system learns from your:</h3>
        <ul>
          <li>Task completion patterns</li>
          <li>Study focus areas</li>
          <li>Timeline and goals</li>
          <li>Academic interests</li>
        </ul>
      </div>
    </section>
  );
}
