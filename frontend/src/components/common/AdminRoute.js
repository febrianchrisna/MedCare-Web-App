import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default AdminRoute;
