import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Dashboard from './pages/Dashboard';
import RecommendationsHub from './pages/RecommendationsHub';
import SmartScheduler from './pages/SmartScheduler';
import OpportunitiesHub from './pages/OpportunitiesHub';
import RoadmapBuilder from './pages/RoadmapBuilder';

function App() {
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <nav className="navbar">
            <div className="nav-brand">NexDex</div>
            <ul className="nav-links">
              <li>
                <Link
                  to="/"
                  onClick={() => setActiveNav('dashboard')}
                  className={activeNav === 'dashboard' ? 'active' : ''}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/recommendations"
                  onClick={() => setActiveNav('recommendations')}
                  className={activeNav === 'recommendations' ? 'active' : ''}
                >
                  AI Suggestions
                </Link>
              </li>
              <li>
                <Link
                  to="/scheduler"
                  onClick={() => setActiveNav('scheduler')}
                  className={activeNav === 'scheduler' ? 'active' : ''}
                >
                  Scheduler
                </Link>
              </li>
              <li>
                <Link
                  to="/opportunities"
                  onClick={() => setActiveNav('opportunities')}
                  className={activeNav === 'opportunities' ? 'active' : ''}
                >
                  Opportunities
                </Link>
              </li>
              <li>
                <Link
                  to="/roadmap"
                  onClick={() => setActiveNav('roadmap')}
                  className={activeNav === 'roadmap' ? 'active' : ''}
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/recommendations" element={<RecommendationsHub />} />
              <Route path="/scheduler" element={<SmartScheduler />} />
              <Route path="/opportunities" element={<OpportunitiesHub />} />
              <Route path="/roadmap" element={<RoadmapBuilder />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;