import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { showSuccess } from '../utils/toast';
import { Menu, LogOut, ShoppingCart, Tag, Box, Clipboard } from 'lucide-react';
import { Button } from './Button';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showSuccess('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: Clipboard, onClick: () => navigate('/dashboard'), path: '/dashboard' },
    { label: 'Categories', icon: Tag, onClick: () => navigate('/categories'), path: '/categories' },
    { label: 'Products', icon: Box, onClick: () => navigate('/products'), path: '/products' },
    { label: 'Orders', icon: ShoppingCart, onClick: () => navigate('/orders'), path: '/orders' },
  ];

  const currentPath = window.location.pathname;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h2 className="text-xl font-bold">POS</h2>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center space-x-3 p-3 rounded transition ${
                currentPath === item.path
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-700 p-4 space-y-3">
          {sidebarOpen && (
            <div className="text-sm">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-gray-400 text-xs">{user?.email}</p>
              {user?.role && (
                <p className="text-xs text-blue-400 mt-1 uppercase">{user.role}</p>
              )}
            </div>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2"
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow p-6 flex justify-between items-center border-b border-gray-200">
          <div>
            <p className="text-gray-600">Welcome, {user?.name}!</p>
            <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-gray-100 min-h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
