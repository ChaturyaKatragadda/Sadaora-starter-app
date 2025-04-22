// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; // We'll create this next
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true); // To check initial auth status
  const navigate = useNavigate();

//==========================================================================================

  // useEffect(() => {
  //   // Set token in api header if it exists
  //   if (token) {
  //     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //     // Optionally fetch user profile here if token exists, to validate it
  //     // e.g., fetchUserProfile();
  //   } else {
  //     delete api.defaults.headers.common['Authorization'];
  //   }
  //   setLoading(false); // Finished initial check
  // }, [token]);

  //=======================================================================================================================
  useEffect(() => {
    if (token) {
      console.log("AuthContext: Setting Authorization header with token:", token); // Add log
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      console.log("AuthContext: Removing Authorization header"); // Add log
      delete api.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]); // Dependency array is important!
  
  //===========================================================================================================================


  const login = async (email, password) => {
    try {
      // Replace with your actual backend endpoint
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken /*, user: userData */ } = response.data; // Adjust based on your API response

      localStorage.setItem('token', newToken);
      setToken(newToken);
      // setUser(userData); // Optionally set user data from login response
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      navigate('/profile'); // Redirect after login
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login errors (e.g., show message to user)
      return false;
    }
  };

  const signup = async (userData) => {
    console.log("Signup: Starting signup process with data:", userData); // ✅ Log input data
  
    try {
      const response = await api.post('/auth/signup', userData);
      console.log("Signup: Server responded successfully:", response.data); // ✅ Log server success
  
      // Optionally automatically log in the user after signup
      // await login(userData.email, userData.password);
  
      navigate('/login'); // Redirect to login after signup
      return true;
    } catch (error) {
      console.error('Signup: Caught error during signup:', error); // ✅ Log caught error
  
      if (error.response) {
        // The server responded with a status code out of the 2xx range
        console.error("Signup: Server responded with an error:", error.response.data); // ✅ Backend error details
        console.error("Signup: Response status:", error.response.status); // ✅ Status code
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Signup: No response received. Request was:", error.request); // ✅ Network issue
      } else {
        // Something else went wrong setting up the request
        console.error("Signup: Error setting up the request:", error.message); // ✅ General error
      }
  
      return false;
    }
  };
  
  // const signup = async (userData) => {
  //    try {
  //      // Replace with your actual backend endpoint
  //      // userData might include { name, email, password }
  //      await api.post('/auth/signup', userData);
  //      // Optionally automatically log in the user after signup
  //      // await login(userData.email, userData.password);
  //      navigate('/login'); // Redirect to login after signup
  //      return true;
  //    } catch (error) {
  //      console.error('Signup failed:', error);
  //      // Handle signup errors
  //      return false;
  //    }
  // };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    navigate('/login'); // Redirect to login page after logout
  };

  // You might want a function to fetch the current user's profile
  // const fetchUserProfile = async () => { ... }

  const value = {
    user,
    token,
    loading, // Expose loading state
    login,
    signup,
    logout,
    isAuthenticated: !!token, // Simple check if token exists
    // fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};
