import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Public Pages
import Login from '../pages/public/Login';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import Filiales from '../pages/admin/Filiales';
import Regions from '../pages/admin/Regions';
import Users from '../pages/admin/Users';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><PublicLayout /></PublicRoute>}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* Admin Routes */}
      <Route 
        path="/admin/*" 
        element={
          <PrivateRoute allowedRoles={['Admin']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="filiales" element={<Filiales />} />
        <Route path="regions" element={<Regions />} />
        <Route path="users" element={<Users />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Country Manager Routes */}
      <Route 
        path="/cm/*" 
        element={
          <PrivateRoute allowedRoles={['Country Manager']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Commercial Routes */}
      <Route 
        path="/commercial/*" 
        element={
          <PrivateRoute allowedRoles={['Commercial']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Distributor Routes */}
      <Route 
        path="/distributor/*" 
        element={
          <PrivateRoute allowedRoles={['Distributor']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Shop Routes */}
      <Route 
        path="/shop/*" 
        element={
          <PrivateRoute allowedRoles={['Shop']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
