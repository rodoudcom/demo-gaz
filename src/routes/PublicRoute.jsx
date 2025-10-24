import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    const roleRoute = `/${user.role.toLowerCase().replace(' ', '')}/dashboard`;
    return <Navigate to={roleRoute} replace />;
  }

  return children;
};
