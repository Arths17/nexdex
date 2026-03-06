import React, { useEffect, useState } from 'react';
import { api } from '../api';

function OpportunitiesHub() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterField, setFilterField] = useState('all');

  const loadOpportunities = async () => {
    try {
      setError('');
      const response = await api.get('/opportunities');
      setOpportunities(response.data);
      setFilteredOpportunities(response.data);
    } catch (requestError) {
      setError('Could not load opportunities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  const applyFilters = async () => {
    try {
      setError('');
      const params = {};
      if (filterType !== 'all') params.type = filterType;
      if (filterField !== 'all') params.field = filterField;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/opportunities', { params });
      setFilteredOpportunities(response.data);
    } catch (requestError) {
      setError('Filter error.');
    }
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterType, filterField]);

  return (
    <section className="card">
      <h1>Opportunities Hub</h1>
      <p className="subtitle">Discover internships, research, and competitions.</p>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Search opportunities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="internship">Internship</option>
          <option value="research">Research</option>
          <option value="competition">Competition</option>
        </select>

        <select value={filterField} onChange={(e) => setFilterField(e.target.value)}>
          <option value="all">All Fields</option>
          <option value="STEM">STEM</option>
          <option value="Finance">Finance</option>
          <option value="Debate">Debate</option>
          <option value="Social Impact">Social Impact</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading opportunities...</p>
      ) : (
        <div className="opportunities-list">
          {filteredOpportunities.length === 0 ? (
            <p className="no-results">No opportunities match your search.</p>
          ) : (
            filteredOpportunities.map((opp) => (
              <div key={opp.id} className="opportunity-card">
                <div className="opp-header">
                  <h3>{opp.title}</h3>
                  <span className={`opp-badge ${opp.type}`}>{opp.type.toUpperCase()}</span>
                </div>
                <p className="opp-field">Field: <strong>{opp.field}</strong></p>
                <p className="opp-description">{opp.description}</p>
                <div className="opp-footer">
                  <span className="deadline">📅 Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                  <a href={opp.link} target="_blank" rel="noopener noreferrer" className="opp-link">
                    Learn More →
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default OpportunitiesHub;
