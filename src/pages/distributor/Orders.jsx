import React, { useState } from 'react';
import { Search, Filter, Eye, Check, X, Clock, Truck, ChevronDown, ChevronRight } from 'lucide-react';
import { Header } from '../../components/Header';
import { Modal } from '../../components/Modal';

const Orders = () => {
    const [orders, setOrders] = useState([
        {
            id: 1,
            orderNumber: 'ORD-001247',
            shopName: 'Gas Station Nord',
            shopCode: 'GS-NORD-001',
            shopAddress: '123 Avenue Hassan II, Casablanca',
            contactName: 'Mohamed Ali',
            contactPhone: '+212 600 123 456',
            orderDate: '2024-10-24 14:30',
            deliveryDate: '2024-10-26',
            status: 'Pending',
            items: [
                { productName: 'Bouteille Gaz 13kg', variant: 'Standard', quantity: 15, unitPrice: 25.99, total: 389.85 },
                { productName: 'Bouteille Gaz 6kg', variant: 'Blue / L', quantity: 10, unitPrice: 15.99, total: 159.90 }
            ],
            subtotal: 549.75,
            deliveryFee: 5.00,
            total: 554.75,
            notes: 'Please deliver in the morning',
            assignedLivreur: null,
            assignedTruck: null
        },
        {
            id: 2,
            orderNumber: 'ORD-001246',
            shopName: 'Mini Market Express',
            shopCode: 'MM-EXP-002',
            shopAddress: '456 Boulevard Zerktouni, Casablanca',
            contactName: 'Fatima Zahra',
            contactPhone: '+212 661 234 567',
            orderDate: '2024-10-24 10:15',
            deliveryDate: '2024-10-25',
            status: 'In Transit',
            items: [
                { productName: 'Bouteille Gaz 13kg', variant: 'Premium', quantity: 20, unitPrice: 28.99, total: 579.80 }
            ],
            subtotal: 579.80,
            deliveryFee: 0,
            total: 579.80,
            notes: '',
            assignedLivreur: 'Ahmed Mohamed',
            assignedTruck: 'MAT-1234-A'
        },
        {
            id: 3,
            orderNumber: 'ORD-001245',
            shopName: 'Depot Central',
            shopCode: 'DC-003',
            shopAddress: '789 Rue de Paris, Casablanca',
            contactName: 'Karim Hassan',
            contactPhone: '+212 652 345 678',
            orderDate: '2024-10-23 16:45',
            deliveryDate: '2024-10-24',
            status: 'Delivered',
            items: [
                { productName: 'Bouteille Gaz 13kg', variant: 'Standard', quantity: 30, unitPrice: 25.99, total: 779.70 },
                { productName: 'Bouteille Gaz 3kg', variant: 'Standard', quantity: 15, unitPrice: 12.99, total: 194.85 }
            ],
            subtotal: 974.55,
            deliveryFee: 0,
            total: 974.55,
            notes: 'Urgent delivery',
            assignedLivreur: 'Omar Hassan',
            assignedTruck: 'MAT-5678-B'
        }
    ]);

    const [expandedOrders, setExpandedOrders] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Mock data for assignment
    const [availableLivreurs] = useState([
        { id: 1, name: 'Ahmed Mohamed' },
        { id: 2, name: 'Omar Hassan' },
        { id: 3, name: 'Youssef Ali' }
    ]);

    const [availableTrucks] = useState([
        { id: 1, matricule: 'MAT-1234-A', model: 'Mercedes Actros' },
        { id: 2, matricule: 'MAT-5678-B', model: 'Volvo FH16' },
        { id: 3, matricule: 'MAT-9012-C', model: 'Scania R450' }
    ]);

    const [assignmentData, setAssignmentData] = useState({
        livreurId: '',
        truckId: ''
    });

    const toggleOrder = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'Processing': 'bg-blue-50 text-blue-700 border-blue-200',
            'In Transit': 'bg-purple-50 text-purple-700 border-purple-200',
            'Delivered': 'bg-green-50 text-green-700 border-green-200',
            'Cancelled': 'bg-red-50 text-red-700 border-red-200'
        };
        return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'Pending': Clock,
            'Processing': Filter,
            'In Transit': Truck,
            'Delivered': Check,
            'Cancelled': X
        };
        return icons[status] || Clock;
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    const handleOpenAssignment = (order) => {
        setSelectedOrder(order);
        setAssignmentData({
            livreurId: '',
            truckId: ''
        });
        setIsAssignModalOpen(true);
    };

    const handleAssignDelivery = () => {
        if (!assignmentData.livreurId || !assignmentData.truckId) {
            alert('Please select both livreur and truck');
            return;
        }

        const livreur = availableLivreurs.find(l => l.id === parseInt(assignmentData.livreurId));
        const truck = availableTrucks.find(t => t.id === parseInt(assignmentData.truckId));

        const updatedOrders = orders.map(o => {
            if (o.id === selectedOrder.id) {
                return {
                    ...o,
                    status: 'In Transit',
                    assignedLivreur: livreur.name,
                    assignedTruck: truck.matricule
                };
            }
            return o;
        });

        setOrders(updatedOrders);
        setIsAssignModalOpen(false);
    };

    const handleStatusChange = (orderId, newStatus) => {
        const updatedOrders = orders.map(o => {
            if (o.id === orderId) {
                return { ...o, status: newStatus };
            }
            return o;
        });
        setOrders(updatedOrders);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shopCode.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        All: orders.length,
        Pending: orders.filter(o => o.status === 'Pending').length,
        'In Transit': orders.filter(o => o.status === 'In Transit').length,
        Delivered: orders.filter(o => o.status === 'Delivered').length
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header
                title="Orders Management"
                subtitle={`Total: ${orders.length} orders`}
            />

            <div className="p-6">
                {/* Status Filters */}
                <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
                    <div className="flex items-center gap-3 overflow-x-auto">
                        {['All', 'Pending', 'In Transit', 'Delivered'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    statusFilter === status
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {status} ({statusCounts[status]})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-roboto w-full bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.map((order) => {
                        const StatusIcon = getStatusIcon(order.status);

                        return (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                {/* Order Header */}
                                <div
                                    className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                                    onClick={() => toggleOrder(order.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                {expandedOrders[order.id] ? (
                                                    <ChevronDown className="w-5 h-5" />
                                                ) : (
                                                    <ChevronRight className="w-5 h-5" />
                                                )}
                                            </button>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-bold text-gray-900 font-nunito">{order.orderNumber}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)} flex items-center gap-1`}>
                            <StatusIcon className="w-3 h-3" />
                                                        {order.status}
                          </span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <p className="text-sm text-gray-700 font-roboto">
                                                        <strong>{order.shopName}</strong> ({order.shopCode})
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-roboto">
                                                        Order: {order.orderDate}
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-roboto">
                                                        Delivery: {order.deliveryDate}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                            <div className="text-right mr-4">
                                                <p className="text-lg font-bold text-red-600 font-nunito">€{order.total.toFixed(2)}</p>
                                                <p className="text-xs text-gray-500 font-roboto">{order.items.length} items</p>
                                            </div>

                                            {order.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleOpenAssignment(order)}
                                                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-all"
                                                    style={{ borderRadius: '25px' }}
                                                >
                                                    <Truck className="w-3 h-3 inline mr-1" />
                                                    Assign
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleViewDetails(order)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details - Expanded */}
                                {expandedOrders[order.id] && (
                                    <div className="p-4 bg-gray-50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            {/* Shop Info */}
                                            <div className="bg-white rounded-lg p-4">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-2 font-nunito">Shop Information</h4>
                                                <div className="space-y-1 text-sm font-roboto">
                                                    <p className="text-gray-700"><strong>Contact:</strong> {order.contactName}</p>
                                                    <p className="text-gray-700"><strong>Phone:</strong> {order.contactPhone}</p>
                                                    <p className="text-gray-600">{order.shopAddress}</p>
                                                </div>
                                            </div>

                                            {/* Delivery Info */}
                                            <div className="bg-white rounded-lg p-4">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-2 font-nunito">Delivery Details</h4>
                                                <div className="space-y-1 text-sm font-roboto">
                                                    {order.assignedLivreur ? (
                                                        <>
                                                            <p className="text-gray-700"><strong>Livreur:</strong> {order.assignedLivreur}</p>
                                                            <p className="text-gray-700"><strong>Truck:</strong> {order.assignedTruck}</p>
                                                        </>
                                                    ) : (
                                                        <p className="text-yellow-600">⚠️ Not assigned yet</p>
                                                    )}
                                                    {order.notes && (
                                                        <p className="text-gray-600 italic mt-2">Note: {order.notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="bg-white rounded-lg overflow-hidden">
                                            <table className="w-full">
                                                <thead className="bg-gray-100 border-b">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase font-nunito">Product</th>
                                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase font-nunito">Variant</th>
                                                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase font-nunito">Qty</th>
                                                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase font-nunito">Unit Price</th>
                                                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase font-nunito">Total</th>
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                {order.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 font-roboto">{item.productName}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600 font-roboto">{item.variant}</td>
                                                        <td className="px-4 py-3 text-sm text-right font-roboto">{item.quantity}</td>
                                                        <td className="px-4 py-3 text-sm text-right font-roboto">€{item.unitPrice.toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-sm font-semibold text-right font-roboto">€{item.total.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50 border-t">
                                                <tr>
                                                    <td colSpan="4" className="px-4 py-2 text-sm text-right font-roboto text-gray-700">Subtotal:</td>
                                                    <td className="px-4 py-2 text-sm font-semibold text-right font-roboto">€{order.subtotal.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="4" className="px-4 py-2 text-sm text-right font-roboto text-gray-700">Delivery Fee:</td>
                                                    <td className="px-4 py-2 text-sm font-semibold text-right font-roboto">
                                                        {order.deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `€${order.deliveryFee.toFixed(2)}`}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="4" className="px-4 py-2 text-sm text-right font-bold font-nunito text-gray-900">Total:</td>
                                                    <td className="px-4 py-2 text-lg font-bold text-right font-nunito text-red-600">€{order.total.toFixed(2)}</td>
                                                </tr>
                                                </tfoot>
                                            </table>
                                        </div>

                                        {/* Status Actions */}
                                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                            <div className="flex justify-end gap-2 mt-4">
                                                {order.status === 'In Transit' && (
                                                    <button
                                                        onClick={() => handleStatusChange(order.id, 'Delivered')}
                                                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-all"
                                                        style={{ borderRadius: '25px' }}
                                                    >
                                                        <Check className="w-4 h-4 inline mr-1" />
                                                        Mark as Delivered
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleStatusChange(order.id, 'Cancelled')}
                                                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all"
                                                    style={{ borderRadius: '25px' }}
                                                >
                                                    <X className="w-4 h-4 inline mr-1" />
                                                    Cancel Order
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {filteredOrders.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <p className="text-gray-500 font-roboto">No orders found</p>
                    </div>
                )}
            </div>

            {/* Assign Delivery Modal */}
            <Modal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                title="Assign Delivery"
                size="md"
            >
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700 font-roboto">
                            <strong className="font-nunito">Order:</strong> {selectedOrder?.orderNumber}
                        </p>
                        <p className="text-sm text-gray-700 font-roboto">
                            <strong className="font-nunito">Shop:</strong> {selectedOrder?.shopName}
                        </p>
                    </div>

                    <div>
                        <label htmlFor="livreur" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                            Select Livreur *
                        </label>
                        <select
                            id="livreur"
                            value={assignmentData.livreurId}
                            onChange={(e) => setAssignmentData({ ...assignmentData, livreurId: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white"
                        >
                            <option value="">Choose a livreur</option>
                            {availableLivreurs.map((livreur) => (
                                <option key={livreur.id} value={livreur.id}>
                                    {livreur.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="truck" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                            Select Truck *
                        </label>
                        <select
                            id="truck"
                            value={assignmentData.truckId}
                            onChange={(e) => setAssignmentData({ ...assignmentData, truckId: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white"
                        >
                            <option value="">Choose a truck</option>
                            {availableTrucks.map((truck) => (
                                <option key={truck.id} value={truck.id}>
                                    {truck.matricule} - {truck.model}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => setIsAssignModalOpen(false)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-all"
                            style={{ borderRadius: '25px' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleAssignDelivery}
                            className="px-4 py-2 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all"
                            style={{ borderRadius: '25px' }}
                        >
                            Assign Delivery
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Orders;
