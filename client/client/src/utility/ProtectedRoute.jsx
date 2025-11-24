import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ roles }) => {
  const { user, role , loading} = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to='/login' />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to='/' />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
