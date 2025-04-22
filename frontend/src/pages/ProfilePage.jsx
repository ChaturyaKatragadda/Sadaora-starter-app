// // src/pages/ProfilePage.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import api from '../services/api';
// import ProfileForm from '../components/ProfileForm'; // Import the form

// function ProfilePage() {
//   const { logout } = useAuth(); // Get logout function
//   const [profile, setProfile] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isEditing, setIsEditing] = useState(false); // To toggle form view
//   const [isSubmitting, setIsSubmitting] = useState(false); // For disabling form buttons

//   // Fetch profile data when component mounts
//   useEffect(() => {
//     const fetchProfile = async () => {
//       setIsLoading(true);
//       setError('');
//       try {
//         // Adjust endpoint as needed (e.g., /profile/me)
//         const response = await api.get('/profile');
//         setProfile(response.data);
//          // If profile exists, default to view mode
//          setIsEditing(false);
//       } catch (err) {
//          if (err.response && err.response.status === 404) {
//            // Profile not found - likely needs to be created
//            setProfile(null); // Ensure profile is null
//            setIsEditing(true); // Go directly to create mode
//            setError('Profile not found. Please create one.');
//          } else {
//            console.error('Failed to fetch profile:', err);
//            setError('Failed to load profile data.');
//          }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []); // Empty dependency array: run only once on mount

//   // --- CRUD Handlers ---

//   const handleCreateProfile = async (formData) => {
//     setIsSubmitting(true);
//     setError('');
//     try {
//       // POST to create profile endpoint
//       const response = await api.post('/profile', formData);
//       setProfile(response.data); // Update state with newly created profile
//       setIsEditing(false); // Switch back to view mode
//     } catch (err) {
//       console.error('Failed to create profile:', err);
//       setError('Failed to create profile. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleUpdateProfile = async (formData) => {
//     setIsSubmitting(true);
//     setError('');
//     try {
//       // PUT to update profile endpoint
//       const response = await api.put('/profile', formData);
//       setProfile(response.data); // Update state with updated profile
//       setIsEditing(false); // Switch back to view mode
//     } catch (err) {
//       console.error('Failed to update profile:', err);
//       setError('Failed to update profile. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//    const handleDeleteProfile = async () => {
//     // Optional: Add a confirmation dialog
//     if (!window.confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
//       return;
//     }

//     setIsSubmitting(true); // Disable buttons during delete
//     setError('');
//     try {
//        // DELETE to profile endpoint
//        await api.delete('/profile');
//        setProfile(null); // Clear profile data
//        setIsEditing(false); // Exit editing mode if any
//        // Optionally log out or navigate away
//        logout(); // Example: log out after deleting profile
//        // navigate('/feed'); // Or navigate somewhere else
//     } catch (err) {
//       console.error('Failed to delete profile:', err);
//       setError('Failed to delete profile. Please try again.');
//        setIsSubmitting(false); // Re-enable buttons on error
//     }
//     // No finally needed if navigating away/logging out on success
//   };

//   // --- Render Logic ---

//   if (isLoading) {
//     return <div>Loading profile...</div>;
//   }

//   return (
//     <div>
//       <h1>Your Profile</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {isEditing ? (
//         // Show the form when editing or creating
//         <ProfileForm
//           initialData={profile} // Pass existing data if editing, null if creating
//           onSubmit={profile ? handleUpdateProfile : handleCreateProfile}
//           onCancel={() => profile ? setIsEditing(false) : setError('Profile creation cancelled.') /* Allow cancelling edit */}
//           isSubmitting={isSubmitting}
//         />
//       ) : (
//         // Show profile details when not editing
//         profile ? (
//           <div>
//             {/* Display profile data - customize as needed */}
//             {profile.photoUrl && <img src={profile.photoUrl} alt={profile.name} width="100" style={{borderRadius:'50%'}} />}
//             <h2>{profile.name || 'No Name Set'}</h2>
//             <h3>{profile.headline || 'No Headline Set'}</h3>
//             <p>{profile.bio || 'No Bio Set'}</p>
//             {profile.interests && profile.interests.length > 0 && (
//                 <div>
//                     <strong>Interests:</strong> {profile.interests.join(', ')}
//                 </div>
//             )}

//             <button onClick={() => setIsEditing(true)} disabled={isSubmitting}>Edit Profile</button>
//             <button onClick={handleDeleteProfile} disabled={isSubmitting} style={{ marginLeft: '10px', color: 'red' }}>
//               Delete Profile
//             </button>
//           </div>
//         ) : (
//           // Should ideally not reach here if fetch logic handles 404 correctly
//           // But as a fallback:
//            <div>
//              <p>No profile found. You might need to create one.</p>
//              {/* Button to trigger create mode explicitly if needed */}
//              <button onClick={() => setIsEditing(true)} >Create Profile Now</button>
//            </div>
//         )
//       )}

//       {/* Add Logout Button - visible whether profile exists or not */}
//       <button onClick={logout} style={{ marginTop: '20px' }}>Logout</button>
//     </div>
//   );
// }

// export default ProfilePage;

//======================================================================================================

// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProfileForm from '../components/ProfileForm';

function ProfilePage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.get('/profile');
        setProfile(response.data);
        setIsEditing(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setProfile(null);
          setIsEditing(true);
          setError('Profile not found. Please create one.');
        } else {
          console.error('Failed to fetch profile:', err);
          setError('Failed to load profile data.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleCreateProfile = async (formData) => {
    setIsSubmitting(true);
    setError('');
    try {
      const response = await api.post('/profile', formData);
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to create profile:', err);
      setError('Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfile = async (formData) => {
    setIsSubmitting(true);
    setError('');
    try {
      const response = await api.put('/profile', formData);
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await api.delete('/profile');
      setProfile(null);
      setIsEditing(false);
      logout();
    } catch (err) {
      console.error('Failed to delete profile:', err);
      setError('Failed to delete profile. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h1>Your Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {isEditing ? (
        <ProfileForm
          initialData={profile}
          onSubmit={profile ? handleUpdateProfile : handleCreateProfile}
          onCancel={() => profile ? setIsEditing(false) : setError('Profile creation cancelled.')}
          isSubmitting={isSubmitting}
        />
      ) : (
        profile ? (
          <div>
            {profile.photoUrl && <img src={profile.photoUrl} alt={profile.name} width="100" style={{ borderRadius: '50%' }} />}
            <h2>{profile.name || 'No Name Set'}</h2>
            <h3>{profile.headline || 'No Headline Set'}</h3>
            <p>{profile.bio || 'No Bio Set'}</p>
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <strong>Interests:</strong> {profile.interests.join(', ')}
              </div>
            )}
            <button onClick={() => setIsEditing(true)} disabled={isSubmitting}>Edit Profile</button>
            <button onClick={handleDeleteProfile} disabled={isSubmitting} style={{ marginLeft: '10px', color: 'red' }}>
              Delete Profile
            </button>
          </div>
        ) : (
          <div>
            <p>No profile found. You might need to create one.</p>
            <button onClick={() => setIsEditing(true)}>Create Profile Now</button>
          </div>
        )
      )}

      <button onClick={logout} style={{ marginTop: '20px' }}>Logout</button>
    </div>
  );
}

export default ProfilePage;

