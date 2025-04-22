// src/components/ProfileForm.jsx
import React, { useState, useEffect } from 'react';

// initialData can be null (for create) or an existing profile object (for update)
// onSubmit is the function to call when the form is submitted (e.g., handleCreateProfile or handleUpdateProfile)
function ProfileForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    bio: '',
    photoUrl: '', // Or handle file upload state if doing that
    interests: '', // Representing as comma-separated string for simplicity
  });

  useEffect(() => {
    // Pre-fill form if initialData is provided (for editing)
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        headline: initialData.headline || '',
        bio: initialData.bio || '',
        photoUrl: initialData.photoUrl || '',
        // Assuming interests are stored as an array in backend, join for display
        interests: Array.isArray(initialData.interests) ? initialData.interests.join(', ') : '',
      });
    } else {
       // Reset form if creating
        setFormData({ name: '', headline: '', bio: '', photoUrl: '', interests: ''});
    }
  }, [initialData]); // Re-run effect if initialData changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Add handler for file input if doing uploads

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert interests string back to array before submitting
    const interestsArray = formData.interests.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    onSubmit({ ...formData, interests: interestsArray });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialData ? 'Edit Profile' : 'Create Profile'}</h2>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Headline:</label>
        <input type="text" name="headline" value={formData.headline} onChange={handleChange} />
      </div>
      <div>
        <label>Bio:</label>
        <textarea name="bio" value={formData.bio} onChange={handleChange}></textarea>
      </div>
      <div>
        <label>Photo URL (Optional):</label>
        <input type="text" name="photoUrl" value={formData.photoUrl} onChange={handleChange} />
        {/* Or: <input type="file" name="photoFile" onChange={handleFileChange} /> */}
      </div>
       <div>
        <label>Interests (comma-separated):</label>
        <input type="text" name="interests" value={formData.interests} onChange={handleChange} placeholder="e.g., react, nodejs, ai" />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : (initialData ? 'Update Profile' : 'Create Profile')}
      </button>
      {onCancel && <button type="button" onClick={onCancel} disabled={isSubmitting}>Cancel</button>}
    </form>
  );
}

export default ProfileForm;