// src/components/ProfileCard.jsx
import React from 'react';

// Simple card to display profile summary
function ProfileCard({ profile }) {
  // Basic styling (inline for simplicity, better to use CSS)
  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    maxWidth: '400px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const imgStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '15px',
    float: 'left', // Simple layout
  };

  const tagStyle = {
    display: 'inline-block',
    backgroundColor: '#eee',
    borderRadius: '3px',
    padding: '2px 6px',
    margin: '2px',
    fontSize: '0.8em',
  };

  return (
    <div style={cardStyle}>
      {profile.photoUrl && <img src={profile.photoUrl} alt={profile.name} style={imgStyle} />}
       {/* Fallback icon/placeholder if no photo? */}
      <div style={{ overflow: 'hidden' }}> {/* Clear float */}
        <h3>{profile.name || 'Unnamed User'}</h3>
        <p style={{ fontStyle: 'italic', color: '#555' }}>{profile.headline || ''}</p>
        {/* <p>{profile.bio || ''}</p> */} {/* Bio might be too long for card */}
         {profile.interests && profile.interests.length > 0 && (
            <div>
                {profile.interests.map((tag, index) => (
                    <span key={index} style={tagStyle}>{tag}</span>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;