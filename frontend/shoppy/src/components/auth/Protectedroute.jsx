import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = useSelector(state => state.user.user);

  if (!user) {

    return <Navigate to="/" replace />; 
  }

  if (!allowedRoles.includes(user.role)) {
   
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
