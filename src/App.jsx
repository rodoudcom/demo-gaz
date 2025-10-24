import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/public/Login';
import Layout from './components/Layout';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminFiliales from './pages/admin/Filiales';
import AdminRegions from './pages/admin/Regions';
import AdminUsers from './pages/admin/Users';

// Country Manager Pages
import CountryManagerDashboard from './pages/countrymanager/Dashboard';
import CountryManagerRegions from './pages/countrymanager/Regions';
import CountryManagerUsers from './pages/countrymanager/Users';
import CountryManagerProducts from './pages/countrymanager/Products.jsx';
import CountryManagerSettings from './pages/countrymanager/Settings';

// Helper function to convert role to URL path
const getRoleBasePath = (role) => {
  if (!role) return '';
  return role.toLowerCase().replace(/\s+/g, '');
};

function App() {
  const { isAuthenticated, user } = useAuthStore();

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      const basePath = getRoleBasePath(user?.role);
      return <Navigate to={`/${basePath}/dashboard`} replace />;
    }

    return <Layout>{children}</Layout>;
  };

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    const basePath = getRoleBasePath(user?.role);
    return `/${basePath}/dashboard`;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          isAuthenticated ? (
            <Navigate to={getDefaultRoute()} replace />
          ) : (
            <Login />
          )
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/filiales" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminFiliales />
          </ProtectedRoute>
        } />
        <Route path="/admin/regions" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminRegions />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />

        {/* Country Manager Routes */}
        <Route path="/countrymanager/dashboard" element={
          <ProtectedRoute allowedRoles={['Country Manager']}>
            <CountryManagerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/countrymanager/regions" element={
          <ProtectedRoute allowedRoles={['Country Manager']}>
            <CountryManagerRegions />
          </ProtectedRoute>
        } />
        <Route path="/countrymanager/users" element={
          <ProtectedRoute allowedRoles={['Country Manager']}>
            <CountryManagerUsers />
          </ProtectedRoute>
        } />
        <Route path="/countrymanager/products" element={
          <ProtectedRoute allowedRoles={['Country Manager']}>
            <CountryManagerProducts />
          </ProtectedRoute>
        } />
        <Route path="/countrymanager/settings" element={
          <ProtectedRoute allowedRoles={['Country Manager']}>
            <CountryManagerSettings />
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        {/* 404 - redirect to dashboard */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
