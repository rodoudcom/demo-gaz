import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  MapPin, 
  Users, 
  Package,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

const getMenuItems = () => {
  // Convert role to URL path (remove spaces, lowercase)
  const baseUrl = `/${user?.role?.toLowerCase().replace(/\s+/g, '')}`;
  
  // Menu items based on role
  if (user?.role === 'Admin') {
    return [
      { path: `${baseUrl}/dashboard`, icon: LayoutDashboard, label: 'Dashboard' },
      { path: `${baseUrl}/filiales`, icon: Building2, label: 'Filiales' },
      { path: `${baseUrl}/regions`, icon: MapPin, label: 'Regions' },
      { path: `${baseUrl}/users`, icon: Users, label: 'Users' },
    ];
  } else if (user?.role === 'Country Manager') {
    return [
      { path: `${baseUrl}/dashboard`, icon: LayoutDashboard, label: 'Dashboard' },
      { path: `${baseUrl}/regions`, icon: MapPin, label: 'Regions' },
      { path: `${baseUrl}/users`, icon: Users, label: 'Users' },
      { path: `${baseUrl}/products`, icon: Package, label: 'Products' },
      { path: `${baseUrl}/settings`, icon: Settings, label: 'Settings' },
    ];
  }
}

  const menuItems = getMenuItems();

  return (
    <aside className="w-60 bg-white shadow-sm flex-shrink-0 min-h-screen border-r border-gray-100">
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center px-5 py-4 border-b border-gray-100">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <h1 className="ml-2 text-gray-800 text-base font-bold font-nunito">
            Pledge
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm group ${
                    isActive 
                      ? 'bg-red-50 text-red-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span className="font-nunito text-sm">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-red-600" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-100 p-3">
          <div className="flex items-center mb-2 px-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
              {user?.fullname?.charAt(0) || 'U'}
            </div>
            <div className="ml-2 flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 font-nunito truncate">{user?.fullname}</p>
              <p className="text-xs text-gray-500 font-roboto truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-xs font-roboto font-medium"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
