// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Navigation is handled within the logout function in AuthContext
  };

  // Basic inline styles, use CSS for better styling
  const navStyle = {
    background: '#f4f4f4',
    padding: '10px 20px',
    marginBottom: '20px',
    borderBottom: '1px solid #ddd',
  };
  const linkStyle = {
    margin: '0 10px',
    textDecoration: 'none',
    color: '#333',
  };
   const buttonStyle = {
     background: 'none',
     border: 'none',
     color: '#333',
     cursor: 'pointer',
     padding: '0',
     margin: '0 10px',
     fontFamily: 'inherit',
     fontSize: 'inherit',
   };


  return (
    <nav style={navStyle}>
      <Link to="/feed" style={linkStyle}>Feed</Link>
      {isAuthenticated ? (
        <>
          <Link to="/profile" style={linkStyle}>My Profile</Link>
          <button onClick={handleLogout} style={buttonStyle}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={linkStyle}>Login</Link>
          <Link to="/signup" style={linkStyle}>Sign Up</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;