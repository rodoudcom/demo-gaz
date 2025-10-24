import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Header } from '../../components/Header';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { useAuthStore } from '../../store/authStore';
import { useRegionStore } from '../../store/regionStore';

const Distributors = () => {
    const { user: currentUser } = useAuthStore();
    const { regions, fetchRegions } = useRegionStore();

    const [distributors, setDistributors] = useState([
        {
            id: 1,
            fullname: 'Ahmed Distribution',
            email: 'ahmed@distribution.com',
            regionId: 1,
            regionName: 'Lagos Region',
            isActive: true,
            createdAt: '2024-10-15'
        },
        {
            id: 2,
            fullname: 'Omar Logistics',
            email: 'omar@logistics.com',
            regionId: 1,
            regionName: 'Lagos Region',
            isActive: true,
            createdAt: '2024-10-10'
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDistributor, setEditingDistributor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        regionId: '',
        isActive: true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch regions for the dropdown
        fetchRegions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenModal = (distributor = null) => {
        if (distributor) {
            setEditingDistributor(distributor);
            setFormData({
                fullname: distributor.fullname,
                email: distributor.email,
                password: '',
                regionId: distributor.regionId,
                isActive: distributor.isActive
            });
        } else {
            setEditingDistributor(null);
            setFormData({
                fullname: '',
                email: '',
                password: '',
                regionId: '',
                isActive: true
            });
        }
        setErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDistributor(null);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullname.trim()) newErrors.fullname = 'Full name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!editingDistributor && !formData.password) {
            newErrors.password = 'Password is required';
        }
        if (!formData.regionId) newErrors.regionId = 'Region is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setTimeout(() => {
            if (editingDistributor) {
                setDistributors(distributors.map(d =>
                    d.id === editingDistributor.id
                        ? { ...d, ...formData, regionName: regions.find(r => r.id === parseInt(formData.regionId))?.name }
                        : d
                ));
            } else {
                const newDistributor = {
                    id: distributors.length + 1,
                    ...formData,
                    regionName: regions.find(r => r.id === parseInt(formData.regionId))?.name,
                    createdAt: new Date().toISOString().split('T')[0]
                };
                setDistributors([...distributors, newDistributor]);
            }
            setLoading(false);
            handleCloseModal();
        }, 500);
    };

    const handleDelete = (distributor) => {
        if (window.confirm(`Are you sure you want to delete ${distributor.fullname}?`)) {
            setDistributors(distributors.filter(d => d.id !== distributor.id));
        }
    };

    const filteredDistributors = distributors.filter(d =>
        d.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: 'ID',
            accessor: 'id',
            render: (row) => (
                <div className="text-xs font-medium text-indigo-600">DIST{String(row.id).padStart(4, '0')}</div>
            )
        },
        {
            header: 'Full Name',
            accessor: 'fullname',
            render: (row) => (
                <div className="font-medium text-gray-900 text-sm">{row.fullname}</div>
            )
        },
        {
            header: 'Email',
            accessor: 'email',
            render: (row) => (
                <div className="text-gray-600 text-sm">{row.email}</div>
            )
        },
        {
            header: 'Region',
            accessor: 'regionName',
            render: (row) => (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
          {row.regionName}
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
                title="Distributors Management"
                subtitle={`Total: ${distributors.length} distributors`}
            />

            <div className="p-6">
                <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex-1 max-w-xs">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    placeholder="Search Distributors..."
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
                            Add Distributor
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm">
                    <DataTable
                        columns={columns}
                        data={filteredDistributors}
                        loading={loading}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                    />

                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-xs text-gray-600 font-roboto">
                            Rows per page: 10
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-600 font-roboto">1-10 of {filteredDistributors.length}</span>
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
                title={editingDistributor ? 'Edit Distributor' : 'Add New Distributor'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fullname" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="fullname"
                                value={formData.fullname}
                                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                className={`w-full px-3 py-2 text-sm border ${errors.fullname ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                                placeholder="Enter full name"
                            />
                            {errors.fullname && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.fullname}</p>}
                        </div>

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
                                placeholder="Enter email address"
                            />
                            {errors.email && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                                Password {!editingDistributor && '*'}
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className={`w-full px-3 py-2 text-sm border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                                placeholder={editingDistributor ? 'Leave blank to keep current' : 'Enter password'}
                            />
                            {errors.password && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="regionId" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                                Region *
                            </label>
                            <select
                                id="regionId"
                                value={formData.regionId}
                                onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
                                className={`w-full px-3 py-2 text-sm border ${errors.regionId ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                            >
                                <option value="">Select a region</option>
                                {regions.map((region) => (
                                    <option key={region.id} value={region.id}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                            {errors.regionId && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.regionId}</p>}
                        </div>

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
                            {editingDistributor ? 'Update' : 'Create'} Distributor
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Distributors;
