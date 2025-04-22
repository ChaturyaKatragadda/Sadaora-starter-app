// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Optional: Show a loading spinner while checking auth status
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows redirecting back after login.
    // You might need to pass state={{ from: location }} in Navigate
    // and handle it in LoginPage if you want to redirect back.
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child route component
  // Outlet is used when nesting routes, children for wrapping a single component
  return children ? children : <Outlet />;
};

export default ProtectedRoute;