import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { useAuthStore } from '../context/authStore';
import { Layout } from '../components/Layout';
import { Loading } from '../components/Loading';
import { ShoppingCart, Tag, Box, TrendingUp, DollarSign, Package } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

export const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalRevenue: 0,
    recentOrders: [],
    categoryStats: [],
    orderTrend: [],
    topProducts: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [orders, products, categories] = await Promise.all([
        orderService.getAll(),
        productService.getAll(),
        categoryService.getAll(),
      ]);

      // Calculate totals
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const recentOrders = orders.slice(-5).reverse();

      // Category stats for pie chart
      const categoryStats = categories.map((cat) => ({
        name: cat.name,
        value: products.filter((p) => p.categoryId === cat.id).length,
      }));

      // Order trend by date
      const ordersByDate = {};
      orders.forEach((order) => {
        const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        ordersByDate[date] = (ordersByDate[date] || 0) + 1;
      });
      const orderTrend = Object.entries(ordersByDate).map(([date, count]) => ({
        date,
        orders: count,
      }));

      // Top products by quantity sold
      const productSales = {};
      orders.forEach((order) => {
        order.items?.forEach((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (product) {
            if (!productSales[product.id]) {
              productSales[product.id] = { name: product.name, quantity: 0, revenue: 0 };
            }
            productSales[product.id].quantity += item.quantity;
            productSales[product.id].revenue += item.quantity * product.price;
          }
        });
      });
      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setDashboardData({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCategories: categories.length,
        totalRevenue,
        recentOrders,
        categoryStats: categoryStats.filter((c) => c.value > 0),
        orderTrend: orderTrend.slice(-7),
        topProducts,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><Loading /></Layout>;

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || 'User'}! Here's your business overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={dashboardData.totalOrders}
            icon={ShoppingCart}
            bgColor="bg-blue-500"
            onClick={() => navigate('/orders')}
          />
          <StatCard
            title="Total Products"
            value={dashboardData.totalProducts}
            icon={Box}
            bgColor="bg-green-500"
            onClick={() => navigate('/products')}
          />
          <StatCard
            title="Categories"
            value={dashboardData.totalCategories}
            icon={Tag}
            bgColor="bg-purple-500"
            onClick={() => navigate('/categories')}
          />
          <StatCard
            title="Total Revenue"
            value={`Rs. ${dashboardData.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            bgColor="bg-amber-500"
            onClick={() => navigate('/orders')}
            isRevenue
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Order Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-blue-500" />
              Order Trend (Last 7 Days)
            </h2>
            {dashboardData.orderTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.orderTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No order data available</p>
            )}
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package size={24} className="text-green-500" />
              Products by Category
            </h2>
            {dashboardData.categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.categoryStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} (${value})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardData.categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} products`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No category data available</p>
            )}
          </div>
        </div>

        {/* Top Products and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Top Products</h2>
            {dashboardData.topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.topProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                  <Bar dataKey="quantity" fill="#10B981" name="Quantity Sold" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No product data available</p>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
            {dashboardData.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">Rs. {order.totalAmount.toFixed(2)}</p>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-12">No orders yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="primary"
              onClick={() => navigate('/orders')}
              className="flex items-center justify-center gap-2 py-3"
            >
              <ShoppingCart size={20} />
              Create Order
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/products')}
              className="flex items-center justify-center gap-2 py-3"
            >
              <Box size={20} />
              Manage Products
            </Button>
            <Button
              variant="success"
              onClick={() => navigate('/categories')}
              className="flex items-center justify-center gap-2 py-3"
            >
              <Tag size={20} />
              Manage Categories
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const StatCard = ({ title, value, icon: Icon, bgColor, onClick, isRevenue }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition transform cursor-pointer border border-gray-200 group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
      <p className={`text-3xl font-bold ${isRevenue ? 'text-green-600' : 'text-gray-800'}`}>{value}</p>
    </button>
  );
};
