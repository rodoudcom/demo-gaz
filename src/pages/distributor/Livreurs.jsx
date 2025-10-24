import React, { useState } from 'react';
import { Plus, Search, Filter, Upload, X, User } from 'lucide-react';
import { Header } from '../../components/Header';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';

const Livreurs = () => {
    const [livreurs, setLivreurs] = useState([
        {
            id: 1,
            fullname: 'Ahmed Mohamed',
            username: 'ahmed.m',
            photo: null,
            isActive: true,
            createdAt: '2024-10-15'
        },
        {
            id: 2,
            fullname: 'Omar Hassan',
            username: 'omar.h',
            photo: null,
            isActive: true,
            createdAt: '2024-10-10'
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLivreur, setEditingLivreur] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        password: '',
        photo: null,
        isActive: true
    });

    const [errors, setErrors] = useState({});

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const photoUrl = URL.createObjectURL(file);
            setFormData({ ...formData, photo: photoUrl });
        }
    };

    const removePhoto = () => {
        setFormData({ ...formData, photo: null });
    };

    const handleOpenModal = (livreur = null) => {
        if (livreur) {
            setEditingLivreur(livreur);
            setFormData({
                fullname: livreur.fullname,
                username: livreur.username,
                password: '',
                photo: livreur.photo,
                isActive: livreur.isActive
            });
        } else {
            setEditingLivreur(null);
            setFormData({
                fullname: '',
                username: '',
                password: '',
                photo: null,
                isActive: true
            });
        }
        setErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingLivreur(null);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullname.trim()) newErrors.fullname = 'Full name is required';
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!editingLivreur && !formData.password) newErrors.password = 'Password is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setTimeout(() => {
            if (editingLivreur) {
                setLivreurs(livreurs.map(l =>
                    l.id === editingLivreur.id ? { ...l, ...formData } : l
                ));
            } else {
                const newLivreur = {
                    id: livreurs.length + 1,
                    ...formData,
                    createdAt: new Date().toISOString().split('T')[0]
                };
                setLivreurs([...livreurs, newLivreur]);
            }
            setLoading(false);
            handleCloseModal();
        }, 500);
    };

    const handleDelete = (livreur) => {
        if (window.confirm(`Are you sure you want to delete ${livreur.fullname}?`)) {
            setLivreurs(livreurs.filter(l => l.id !== livreur.id));
        }
    };

    const filteredLivreurs = livreurs.filter(l =>
        l.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: 'Photo',
            accessor: 'photo',
            render: (row) => (
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {row.photo ? (
                        <img src={row.photo} alt={row.fullname} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            )
        },
        {
            header: 'ID',
            accessor: 'id',
            render: (row) => (
                <div className="text-xs font-medium text-indigo-600">LIV{String(row.id).padStart(4, '0')}</div>
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
            header: 'Username',
            accessor: 'username',
            render: (row) => (
                <div className="text-gray-600 text-sm">{row.username}</div>
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
                title="Livreurs Management"
                subtitle={`Total: ${livreurs.length} livreurs`}
            />

            <div className="p-6">
                <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex-1 max-w-xs">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    placeholder="Search Livreurs..."
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
                            Add Livreur
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm">
                    <DataTable
                        columns={columns}
                        data={filteredLivreurs}
                        loading={loading}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                    />

                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-xs text-gray-600 font-roboto">
                            Rows per page: 10
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-600 font-roboto">1-10 of {filteredLivreurs.length}</span>
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
                title={editingLivreur ? 'Edit Livreur' : 'Add New Livreur'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Photo Upload */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                            Photo (Optional)
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                {formData.photo ? (
                                    <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-600 transition-colors">
                                    <Upload className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-600 font-roboto">Upload Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                    />
                                </label>
                                {formData.photo && (
                                    <button
                                        type="button"
                                        onClick={removePhoto}
                                        className="mt-2 text-xs text-red-600 hover:text-red-700 font-roboto flex items-center"
                                    >
                                        <X className="w-3 h-3 mr-1" />
                                        Remove Photo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

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
                        <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                            Username *
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className={`w-full px-3 py-2 text-sm border ${errors.username ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                            placeholder="Enter username"
                        />
                        {errors.username && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.username}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                            Password {!editingLivreur && '*'}
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={`w-full px-3 py-2 text-sm border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                            placeholder={editingLivreur ? 'Leave blank to keep current' : 'Enter password'}
                        />
                        {errors.password && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.password}</p>}
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
                            {editingLivreur ? 'Update' : 'Create'} Livreur
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Livreurs;
