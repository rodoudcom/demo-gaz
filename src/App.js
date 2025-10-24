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

//Commercial Pges
import CommercialDashboard from './pages/commercial/Dashboard';
import CommercialDistributors from './pages/commercial/Distributors';
import CommercialShops from './pages/commercial/Shops';

//Dist pages
import DistributorDashboard from './pages/distributor/Dashboard';
import DistributorLivreurs from './pages/distributor/Livreurs';
import DistributorTrucks from './pages/distributor/Trucks';
import DistributorProducts from './pages/distributor/Products';
import DistributorSettings from './pages/distributor/Settings';

//Order page
import ShopOrder from './pages/public/ShopOrder';
import OrderSuccess from './pages/public/OrderSuccess';

import DistributorOrders from './pages/distributor/Orders';

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

        {/* Commercial Routes */}
        <Route path="/commercial/dashboard" element={
          <ProtectedRoute allowedRoles={['Commercial']}>
            <CommercialDashboard />
          </ProtectedRoute>
        } />
        <Route path="/commercial/distributors" element={
          <ProtectedRoute allowedRoles={['Commercial']}>
            <CommercialDistributors />
          </ProtectedRoute>
        } />
        <Route path="/commercial/shops" element={
          <ProtectedRoute allowedRoles={['Commercial']}>
            <CommercialShops />
          </ProtectedRoute>
        } />

        {/* Distributor Routes */}
        <Route path="/distributor/dashboard" element={
          <ProtectedRoute allowedRoles={['Distributor']}>
            <DistributorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/distributor/orders" element={
          <ProtectedRoute allowedRoles={['Distributor']}>
            <DistributorOrders />
          </ProtectedRoute>
        } />
        <Route path="/distributor/livreurs" element={
          <ProtectedRoute allowedRoles={['Distributor']}>
            <DistributorLivreurs />
          </ProtectedRoute>
        } />
        <Route path="/distributor/trucks" element={
          <ProtectedRoute allowedRoles={['Distributor']}>
            <DistributorTrucks />
          </ProtectedRoute>
        } />
        <Route path="/distributor/products" element={
          <ProtectedRoute allowedRoles={['Distributor']}>
            <DistributorProducts />
          </ProtectedRoute>
        } />
        <Route path="/distributor/settings" element={
          <ProtectedRoute allowedRoles={['Distributor']}>
            <DistributorSettings />
          </ProtectedRoute>
        } />

        <Route path="/shop-order" element={<ShopOrder />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        {/* 404 - redirect to dashboard */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
