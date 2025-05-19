import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, STORAGE_KEYS } from '../config/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // If JSON parsing fails, clear storage
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      }, {
        withCredentials: true // Enable cookies for refresh token
      });
      
      if (!response.data || !response.data.accessToken) {
        throw new Error('Invalid response from server');
      }
      
      const { safeUserData, accessToken } = response.data;
      
      if (!safeUserData) {
        throw new Error('User data not received from server');
      }
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(safeUserData));
      
      setUser(safeUserData);
      return true;
    } catch (err) {
      console.error('Login Error:', err);
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (err.response) {
        errorMessage = err.response.data?.message || errorMessage;
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await axios.post(`${API_URL}/register`, userData);
      
      if (!response.data || response.data.status !== 'Success') {
        throw new Error(response.data?.message || 'Registration failed');
      }
      
      return true;
    } catch (err) {
      console.error('Registration Error:', err);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response) {
        errorMessage = err.response.data?.message || errorMessage;
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Get token for logout request
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      
      if (token) {
        // Call the logout API endpoint
        await axios.get(`${API_URL}/logout`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (err) {
      console.error('Logout Error:', err);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
      setLoading(false);
    }
    
    return true;
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Authentication flow:
  // 1. User submits login/register form
  // 2. AuthContext sends request to the backend
  // 3. On success, stores token and user data in localStorage
  // 4. Sets the user state, making it available throughout the app
  // 5. Protected routes use isAuthenticated() to verify user access
  // 6. Admin routes use isAdmin() to verify admin privileges

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        login, 
        register, 
        logout, 
        isAuthenticated, 
        isAdmin 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
