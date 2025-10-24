import React from 'react';
import { Header } from '../../components/Header';
import { useAuthStore } from '../../store/authStore';
import {
    TrendingUp,
    Users,
    Truck,
    Package,
    ShoppingCart
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuthStore();

    const stats = [
        {
            title: 'Total Orders',
            value: '156',
            change: '+15.3%',
            positive: true,
            icon: ShoppingCart,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            title: "Chiffre d'Affaires",
            value: '€12,850',
            change: '+9.2%',
            positive: true,
            icon: TrendingUp,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            title: 'Active Livreurs',
            value: '8',
            change: '+1 new',
            positive: true,
            icon: Users,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600'
        },
        {
            title: 'Available Trucks',
            value: '5',
            change: '3 in delivery',
            positive: true,
            icon: Truck,
            bgColor: 'bg-orange-100',
            iconColor: 'text-orange-600'
        },
        {
            title: 'Products in Stock',
            value: '18',
            change: '92% available',
            positive: true,
            icon: Package,
            bgColor: 'bg-pink-100',
            iconColor: 'text-pink-600'
        },
    ];

    const recentDeliveries = [
        { id: '#DEL-847', livreur: 'Ahmed Mohamed', truck: 'MAT-1234-A', status: 'In Transit', date: 'Oct 24, 2025' },
        { id: '#DEL-846', livreur: 'Omar Hassan', truck: 'MAT-5678-B', status: 'Delivered', date: 'Oct 24, 2025' },
        { id: '#DEL-845', livreur: 'Youssef Ali', truck: 'MAT-9012-C', status: 'In Transit', date: 'Oct 23, 2025' },
        { id: '#DEL-844', livreur: 'Karim Mahmoud', truck: 'MAT-3456-D', status: 'Delivered', date: 'Oct 23, 2025' },
    ];

    const getStatusColor = (status) => {
        const colors = {
            'In Transit': 'bg-blue-100 text-blue-800',
            'Delivered': 'bg-green-100 text-green-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
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

                {/* Recent Deliveries */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 font-nunito">Recent Deliveries</h2>
                            <p className="text-xs text-gray-600 mt-0.5 font-roboto">Latest delivery activities</p>
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
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider font-nunito">Delivery ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider font-nunito">Livreur</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider font-nunito">Truck</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider font-nunito">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider font-nunito">Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {recentDeliveries.map((delivery, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 font-roboto">
                                        {delivery.id}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-roboto">
                                        {delivery.livreur}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-roboto">
                                        {delivery.truck}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-roboto">
                                        {delivery.date}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(delivery.status)} font-roboto`}>
                        {delivery.status}
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
