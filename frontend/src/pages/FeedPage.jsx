// src/pages/FeedPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProfileCard from '../components/ProfileCard';

function FeedPage() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // Add state for pagination/infinite scroll if implementing

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Adjust endpoint: GET /profiles should return list of *other* users' profiles
        // Your backend needs to handle excluding the logged-in user
        const response = await api.get('/profiles'); // Or '/users', '/feed' etc.
        setProfiles(response.data || []); // Ensure it's an array
      } catch (err) {
        console.error('Failed to fetch profiles:', err);
        setError('Failed to load the feed.');
        // Handle specific errors like 401 Unauthorized if needed
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []); // Fetch once on mount

  if (isLoading) {
    return <div>Loading feed...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h1>Public Feed</h1>
      {profiles.length === 0 ? (
        <p>No other users to display yet.</p>
      ) : (
        <div>
          {profiles.map(profile => (
             // Assuming each profile object has a unique 'id' or 'userId'
             <ProfileCard key={profile.id || profile.userId} profile={profile} />
          ))}
        </div>
      )}
      {/* Add pagination controls or infinite scroll listener here */}
    </div>
  );
}

export default FeedPage;