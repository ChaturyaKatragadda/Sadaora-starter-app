// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import FeedPage from './pages/FeedPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      {<Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Routes accessible to everyone (logged in or not) */}
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/" element={<FeedPage />} /> {/* Example: Feed is public home */}

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
         {/* Add other protected routes here */}

      </Routes>
    </div>
  );
}

export default App;