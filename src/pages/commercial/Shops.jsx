import React, { useState } from 'react';
import { Plus, Search, Filter, MapPin, QrCode, Mail } from 'lucide-react';
import { Header } from '../../components/Header';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';

const Shops = () => {
    const [shops, setShops] = useState([
        {
            id: 1,
            shopName: 'Gas Station Nord',
            contactName: 'Mohamed Ali',
            phone: '+212 600 123 456',
            address: '123 Avenue Hassan II, Casablanca',
            longitude: -7.6177,
            latitude: 33.5731,
            code: 'GS-NORD-001',
            authMethod: 'email',
            email: 'gasstation.nord@example.com',
            isActive: true,
            createdAt: '2024-10-15'
        },
        {
            id: 2,
            shopName: 'Mini Market Express',
            contactName: 'Fatima Zahra',
            phone: '+212 661 234 567',
            address: '456 Boulevard Zerktouni, Casablanca',
            longitude: -7.6189,
            latitude: 33.5792,
            code: 'MM-EXP-002',
            authMethod: 'qrcode',
            qrCode: 'QR-MM-EXP-002-XYZ123',
            isActive: true,
            createdAt: '2024-10-12'
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingShop, setEditingShop] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        shopName: '',
        contactName: '',
        phone: '',
        address: '',
        longitude: '',
        latitude: '',
        code: '',
        authMethod: 'email',
        email: '',
        password: '',
        qrCode: '',
        isActive: true
    });

    const [errors, setErrors] = useState({});

    const handleOpenModal = (shop = null) => {
        if (shop) {
            setEditingShop(shop);
            setFormData({
                shopName: shop.shopName,
                contactName: shop.contactName,
                phone: shop.phone,
                address: shop.address,
                longitude: shop.longitude,
                latitude: shop.latitude,
                code: shop.code,
                authMethod: shop.authMethod,
                email: shop.email || '',
                password: '',
                qrCode: shop.qrCode || '',
                isActive: shop.isActive
            });
        } else {
            setEditingShop(null);
            setFormData({
                shopName: '',
                contactName: '',
                phone: '',
                address: '',
                longitude: '',
                latitude: '',
                code: '',
                authMethod: 'email',
                email: '',
                password: '',
                qrCode: '',
                isActive: true
            });
        }
        setErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingShop(null);
        setErrors({});
    };

    const generateQRCode = () => {
        const randomCode = `QR-${formData.code || 'SHOP'}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        setFormData({ ...formData, qrCode: randomCode });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
        if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.code.trim()) newErrors.code = 'Shop code is required';

        // Validate coordinates
        if (formData.longitude && (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180)) {
            newErrors.longitude = 'Valid longitude required (-180 to 180)';
        }
        if (formData.latitude && (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90)) {
            newErrors.latitude = 'Valid latitude required (-90 to 90)';
        }

        // Auth method specific validation
        if (formData.authMethod === 'email') {
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Email is invalid';
            }
            if (!editingShop && !formData.password) {
                newErrors.password = 'Password is required';
            }
        } else if (formData.authMethod === 'qrcode') {
            if (!formData.qrCode.trim()) {
                newErrors.qrCode = 'QR code is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setTimeout(() => {
            if (editingShop) {
                setShops(shops.map(s =>
                    s.id === editingShop.id ? { ...s, ...formData } : s
                ));
            } else {
                const newShop = {
                    id: shops.length + 1,
                    ...formData,
                    createdAt: new Date().toISOString().split('T')[0]
                };
                setShops([...shops, newShop]);
            }
            setLoading(false);
            handleCloseModal();
        }, 500);
    };

    const handleDelete = (shop) => {
        if (window.confirm(`Are you sure you want to delete ${shop.shopName}?`)) {
            setShops(shops.filter(s => s.id !== shop.id));
        }
    };

    const filteredShops = shops.filter(s =>
        s.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: 'Code',
            accessor: 'code',
            render: (row) => (
                <div className="text-xs font-medium text-indigo-600">{row.code}</div>
            )
        },
        {
            header: 'Shop Name',
            accessor: 'shopName',
            render: (row) => (
                <div className="font-medium text-gray-900 text-sm">{row.shopName}</div>
            )
        },
        {
            header: 'Contact',
            accessor: 'contactName',
            render: (row) => (
                <div>
                    <div className="text-gray-900 text-sm">{row.contactName}</div>
                    <div className="text-gray-500 text-xs">{row.phone}</div>
                </div>
            )
        },
        {
            header: 'Address',
            accessor: 'address',
            render: (row) => (
                <div className="text-gray-600 text-sm max-w-xs truncate">{row.address}</div>
            )
        },
        {
            header: 'Auth Method',
            accessor: 'authMethod',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit ${
                    row.authMethod === 'email' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                }`}>
          {row.authMethod === 'email' ? <Mail className="w-3 h-3" /> : <QrCode className="w-3 h-3" />}
                    {row.authMethod === 'email' ? 'Email/Password' : 'QR Code'}
        </span>
            )
        },
        {
            header: 'Status',
            accessor: 'isActive',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                    row.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
            )
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header
                title="Point of Sale Management"
                subtitle={`Total: ${shops.length} shops`}
            />

            <div className="p-6">
                <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex-1 max-w-xs">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    placeholder="Search Shops..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-roboto w-full bg-white"
                                />
                            </div>

                            <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-roboto flex items-center">
                                <Filter className="w-4 h-4 mr-1.5" />
                                Filter
                            </button>
                        </div>

                        <button
                            onClick={() => handleOpenModal()}
                            className="px-4 py-2 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all flex items-center"
                            style={{ borderRadius: '25px' }}
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            Add Shop
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm">
                    <DataTable
                        columns={columns}
                        data={filteredShops}
                        loading={loading}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                    />

                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-xs text-gray-600 font-roboto">
                            Rows per page: 10
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-600 font-roboto">1-10 of {filteredShops.length}</span>
                            <div className="flex items-center gap-1">
                                <button className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                                    ← Previous
                                </button>
                                <button className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingShop ? 'Edit Point of Sale' : 'Add New Point of Sale'}
                size="xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Shop Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 font-nunito">Shop Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="shopName" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                                    Shop Name *
                                </label>
                                <input
                                    type="text"
                                    id="shopName"
                                    value={formData.shopName}
                                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                                    className={`w-full px-3 py-2 text-sm border ${errors.shopName ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                                    placeholder="Enter shop name"
                                />
                                {errors.shopName && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.shopName}</p>}
                            </div>

                            <div>
                                <label htmlFor="code" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                                    Shop Code *
                                </label>
                                <input
                                    type="text"
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className={`w-full px-3 py-2 text-sm border ${errors.code ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                                    placeholder="e.g., GS-NORD-001"
                                />
                                {errors.code && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.code}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 font-nunito">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="contactName" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                                    Contact Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="contactName"
                                    value={formData.contactName}
                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    className={`w-full px-3 py-2 text-sm border ${errors.contactName ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                                    placeholder="Enter contact name"
                                />
                                {errors.contactName && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.contactName}</p>}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                                    Phone Number *
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={`w-full px-3 py-2 text-sm border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                                    placeholder="+212 600 123 456"
                                />
                                {errors.phone && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.phone}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 font-nunito">Location Information</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                                    Address *
                                </label>
                                <textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows="2"
                                    className={`w-full px-3 py-2 text-sm border ${errors.address ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                                    placeholder="Enter full address"
                                />
                                {errors.address && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.address}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="longitude" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                                        Longitude
                                    </label>
                                    <div className="relative">
                                        <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                                        <input
                                            type="text"
                                            id="longitude"
                                            value={formData.longitude}
                                            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                            className={`w-full pl-9 pr-3 py-2 text-sm border ${errors.longitude ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                                            placeholder="-7.6177"
                                        />
                                    </div>
                                    {errors.longitude && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.longitude}</p>}
                                </div>

                                <div>
                                    <label htmlFor="latitude" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                                        Latitude
                                    </label>
                                    <div className="relative">
                                        <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                                        <input
                                            type="text"
                                            id="latitude"
                                            value={formData.latitude}
                                            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                            className={`w-full pl-9 pr-3 py-2 text-sm border ${errors.latitude ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                                            placeholder="33.5731"
                                        />
                                    </div>
                                    {errors.latitude && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.latitude}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Authentication Method */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 font-nunito">Authentication Method</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2 font-nunito">
                                    Select Auth Method *
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            value="email"
                                            checked={formData.authMethod === 'email'}
                                            onChange={(e) => setFormData({ ...formData, authMethod: e.target.value })}
                                            className="w-4 h-4 text-red-600 focus:ring-red-600"
                                        />
                                        <Mail className="w-4 h-4 ml-2 mr-1.5 text-gray-600" />
                                        <span className="text-sm text-gray-700 font-roboto">Email/Password</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            value="qrcode"
                                            checked={formData.authMethod === 'qrcode'}
                                            onChange={(e) => setFormData({ ...formData, authMethod: e.target.value })}
                                            className="w-4 h-4 text-red-600 focus:ring-red-600"
                                        />
                                        <QrCode className="w-4 h-4 ml-2 mr-1.5 text-gray-600" />
                                        <span className="text-sm text-gray-700 font-roboto">Scan QR Code</span>
                                    </label>
                                </div>
                            </div>

                            {/* Email/Password Fields */}
                            {formData.authMethod === 'email' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={`w-full px-3 py-2 text-sm border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                                            placeholder="shop@example.com"
                                        />
                                        {errors.email && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                                            Password {!editingShop && '*'}
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className={`w-full px-3 py-2 text-sm border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                                            placeholder={editingShop ? 'Leave blank to keep current' : 'Enter password'}
                                        />
                                        {errors.password && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.password}</p>}
                                    </div>
                                </div>
                            )}

                            {/* QR Code Field */}
                            {formData.authMethod === 'qrcode' && (
                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <label htmlFor="qrCode" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                                        QR Code *
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="qrCode"
                                            value={formData.qrCode}
                                            onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                                            className={`flex-1 px-3 py-2 text-sm border ${errors.qrCode ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                                            placeholder="QR code value"
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            onClick={generateQRCode}
                                            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-all rounded-lg"
                                        >
                                            Generate QR
                                        </button>
                                    </div>
                                    {errors.qrCode && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.qrCode}</p>}
                                    <p className="text-xs text-gray-600 mt-2 font-roboto">Click "Generate QR" to create a unique QR code for this shop</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="isActive" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                            Status
                        </label>
                        <select
                            id="isActive"
                            value={formData.isActive.toString()}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white"
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-all"
                            style={{ borderRadius: '25px' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all"
                            style={{ borderRadius: '25px' }}
                        >
                            {editingShop ? 'Update' : 'Create'} Shop
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Shops;
