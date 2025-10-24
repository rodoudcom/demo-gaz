import React from 'react';
import { Header } from '../../components/Header';
import { useAuthStore } from '../../store/authStore';
import {
    TrendingUp,
    Users,
    Building2,
    ShoppingCart
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuthStore();

    const stats = [
        {
            title: 'Total Orders',
            value: '342',
            change: '+8.5%',
            positive: true,
            icon: ShoppingCart,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            title: "Chiffre d'Affaires",
            value: '€28,450',
            change: '+12.2%',
            positive: true,
            icon: TrendingUp,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            title: 'Active Distributors',
            value: '12',
            change: '+2 new',
            positive: true,
            icon: Users,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600'
        },
        {
            title: 'Point of Sale',
            value: '45',
            change: '+5 new',
            positive: true,
            icon: Building2,
            bgColor: 'bg-orange-100',
            iconColor: 'text-orange-600'
        },
    ];

    const recentOrders = [
        { id: '#ORD-1247', shop: 'Shop Express', status: 'Pending', amount: '€1,250.00', date: 'Oct 24, 2025' },
        { id: '#ORD-1246', shop: 'Gas Station Nord', status: 'Completed', amount: '€3,800.00', date: 'Oct 23, 2025' },
        { id: '#ORD-1245', shop: 'Depot Central', status: 'Processing', amount: '€2,150.00', date: 'Oct 23, 2025' },
        { id: '#ORD-1244', shop: 'Mini Market', status: 'Completed', amount: '€950.00', date: 'Oct 22, 2025' },
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
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                                            <TrendingUp className="w-3.5 h-3.5 text-green-600 mr-1" />
                                            <span className="text-xs font-medium font-roboto text-green-600">
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
                            <p className="text-xs text-gray-600 mt-0.5 font-roboto">Latest transactions from your shops</p>
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
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider font-nunito">Shop</th>
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
                                        {order.shop}
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
