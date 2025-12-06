import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuthStore } from '../context/authStore';
import { Layout } from '../components/Layout';
import { ShoppingCart, Tag, Box } from 'lucide-react';

export const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Stats Cards */}
          <DashboardCard
            title="Categories"
            icon={Tag}
            onClick={() => navigate('/categories')}
          />
          <DashboardCard
            title="Products"
            icon={Box}
            onClick={() => navigate('/products')}
          />
          <DashboardCard
            title="Orders"
            icon={ShoppingCart}
            onClick={() => navigate('/orders')}
          />
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to POS System</h2>
          <p className="text-gray-600 mb-4">
            Manage your business efficiently with our comprehensive Point of Sale system.
          </p>
          <p className="text-gray-600 mb-6">
            Use the navigation menu to access categories, products, orders, and more.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="primary"
              onClick={() => navigate('/products')}
            >
              View Products
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/categories')}
            >
              Manage Categories
            </Button>
            <Button
              variant="success"
              onClick={() => navigate('/orders')}
            >
              Create Order
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const DashboardCard = ({ title, icon: Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg hover:scale-105 transition transform cursor-pointer"
    >
      <Icon size={32} className="text-blue-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-500 text-sm mt-2">Manage {title.toLowerCase()}</p>
    </button>
  );
};
