import React from 'react';
import { Header } from '../../components/Header';
import { useAuthStore } from '../../store/authStore';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  MapPin, 
  ShoppingCart,
  Package,
  DollarSign
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'Total Orders',
      value: '1,847',
      change: '+12.5%',
      positive: true,
      icon: ShoppingCart,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: "Chiffre d'Affaires",
      value: '€89,420',
      change: '+8.2%',
      positive: true,
      icon: DollarSign,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Active Users',
      value: '342',
      change: '+24 new',
      positive: true,
      icon: Users,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Products',
      value: '125',
      change: '-2 items',
      positive: false,
      icon: Package,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Filiales',
      value: '5',
      change: '+1 new',
      positive: true,
      icon: Building2,
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      title: 'Regions',
      value: '18',
      change: '+3 new',
      positive: true,
      icon: MapPin,
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
  ];

  const recentOrders = [
    { id: '#ORD-2547', customer: 'Tech Store Ltd', status: 'Pending', amount: '€4,250.00', date: 'Oct 24, 2025' },
    { id: '#ORD-2546', customer: 'Global Distributors', status: 'Completed', amount: '€12,800.00', date: 'Oct 23, 2025' },
    { id: '#ORD-2545', customer: 'Premium Retail Chain', status: 'Processing', amount: '€8,950.00', date: 'Oct 23, 2025' },
    { id: '#ORD-2544', customer: 'Regional Sales Office', status: 'Completed', amount: '€25,600.00', date: 'Oct 22, 2025' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header 
        title="Dashboard Overview"
        subtitle={`Welcome back, ${user?.fullname}`}
      />

      <div className="p-6">
        {/* Stats Grid - Smaller Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-roboto mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 font-nunito mb-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center">
                      {stat.positive ? (
                        <TrendingUp className="w-3.5 h-3.5 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-red-600 mr-1" />
                      )}
                      <span className={`text-xs font-medium font-roboto ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-nunito">Recent Orders</h2>
              <p className="text-xs text-gray-600 mt-0.5 font-roboto">Latest transactions</p>
            </div>
            <button 
  className="px-4 py-2 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all"
  style={{ borderRadius: '25px' }}
>
  View All
</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider font-nunito">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider font-nunito">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider font-nunito">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider font-nunito">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider font-nunito">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 font-roboto">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-roboto">
                      {order.customer}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-roboto">
                      {order.date}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 font-roboto">
                      {order.amount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)} font-roboto`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
