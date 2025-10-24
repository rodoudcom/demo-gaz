import React, { useState } from 'react';
import { Plus, Search, Filter, Truck as TruckIcon, Users, UserPlus, X } from 'lucide-react';
import { Header } from '../../components/Header';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';

const Trucks = () => {
    const [trucks, setTrucks] = useState([
        {
            id: 1,
            model: 'Mercedes Actros',
            matricule: 'MAT-1234-A',
            maxTon: 12,
            type: 'Refrigerated',
            assignedLivreurs: [
                { id: 1, name: 'Ahmed Mohamed' },
                { id: 2, name: 'Omar Hassan' }
            ],
            isActive: true,
            createdAt: '2024-10-15'
        },
        {
            id: 2,
            model: 'Volvo FH16',
            matricule: 'MAT-5678-B',
            maxTon: 18,
            type: 'Standard',
            assignedLivreurs: [],
            isActive: true,
            createdAt: '2024-10-10'
        },
        {
            id: 3,
            model: 'Scania R450',
            matricule: 'MAT-9012-C',
            maxTon: 15,
            type: 'Standard',
            assignedLivreurs: [
                { id: 3, name: 'Youssef Ali' }
            ],
            isActive: true,
            createdAt: '2024-10-05'
        }
    ]);

    const [availableLivreurs] = useState([
        { id: 1, name: 'Ahmed Mohamed' },
        { id: 2, name: 'Omar Hassan' },
        { id: 3, name: 'Youssef Ali' },
        { id: 4, name: 'Karim Mahmoud' },
        { id: 5, name: 'Hassan Ibrahim' }
    ]);

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [editingTruck, setEditingTruck] = useState(null);
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterFree, setFilterFree] = useState(false);

    const [formData, setFormData] = useState({
        model: '',
        matricule: '',
        maxTon: '',
        type: 'Standard',
        isActive: true
    });

    const [selectedLivreurs, setSelectedLivreurs] = useState([]);
    const [errors, setErrors] = useState({});

    const truckTypes = ['Standard', 'Refrigerated', 'Tanker', 'Flatbed'];

    const handleOpenModal = (truck = null) => {
        if (truck) {
            setEditingTruck(truck);
            setFormData({
                model: truck.model,
                matricule: truck.matricule,
                maxTon: truck.maxTon,
                type: truck.type,
                isActive: truck.isActive
            });
        } else {
            setEditingTruck(null);
            setFormData({
                model: '',
                matricule: '',
                maxTon: '',
                type: 'Standard',
                isActive: true
            });
        }
        setErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTruck(null);
        setErrors({});
    };

    const handleOpenAssignModal = (truck) => {
        setSelectedTruck(truck);
        setSelectedLivreurs(truck.assignedLivreurs.map(l => l.id));
        setIsAssignModalOpen(true);
    };

    const handleCloseAssignModal = () => {
        setIsAssignModalOpen(false);
        setSelectedTruck(null);
        setSelectedLivreurs([]);
    };

    const toggleLivreurSelection = (livreurId) => {
        if (selectedLivreurs.includes(livreurId)) {
            setSelectedLivreurs(selectedLivreurs.filter(id => id !== livreurId));
        } else {
            setSelectedLivreurs([...selectedLivreurs, livreurId]);
        }
    };

    const handleAssignLivreurs = () => {
        const updatedTrucks = trucks.map(t => {
            if (t.id === selectedTruck.id) {
                return {
                    ...t,
                    assignedLivreurs: availableLivreurs.filter(l => selectedLivreurs.includes(l.id))
                };
            }
            return t;
        });
        setTrucks(updatedTrucks);
        handleCloseAssignModal();
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.model.trim()) newErrors.model = 'Model is required';
        if (!formData.matricule.trim()) newErrors.matricule = 'Matricule is required';
        if (!formData.maxTon || formData.maxTon <= 0) newErrors.maxTon = 'Max ton must be greater than 0';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setTimeout(() => {
            if (editingTruck) {
                setTrucks(trucks.map(t =>
                    t.id === editingTruck.id ? { ...t, ...formData } : t
                ));
            } else {
                const newTruck = {
                    id: trucks.length + 1,
                    ...formData,
                    assignedLivreurs: [],
                    createdAt: new Date().toISOString().split('T')[0]
                };
                setTrucks([...trucks, newTruck]);
            }
            setLoading(false);
            handleCloseModal();
        }, 500);
    };

    const handleDelete = (truck) => {
        if (window.confirm(`Are you sure you want to delete truck ${truck.matricule}?`)) {
            setTrucks(trucks.filter(t => t.id !== truck.id));
        }
    };

    const filteredTrucks = trucks.filter(t => {
        const matchesSearch =
            t.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.matricule.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFreeFilter = !filterFree || t.assignedLivreurs.length === 0;

        return matchesSearch && matchesFreeFilter;
    });

    const columns = [
        {
            header: 'Matricule',
            accessor: 'matricule',
            render: (row) => (
                <div className="text-xs font-medium text-indigo-600">{row.matricule}</div>
            )
        },
        {
            header: 'Model',
            accessor: 'model',
            render: (row) => (
                <div className="font-medium text-gray-900 text-sm">{row.model}</div>
            )
        },
        {
            header: 'Max Capacity',
            accessor: 'maxTon',
            render: (row) => (
                <div className="text-gray-700 text-sm font-semibold">{row.maxTon} tons</div>
            )
        },
        {
            header: 'Type',
            accessor: 'type',
            render: (row) => (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
          {row.type}
        </span>
            )
        },
        {
            header: 'Assigned Livreurs',
            accessor: 'assignedLivreurs',
            render: (row) => (
                <div className="flex items-center gap-2">
                    {row.assignedLivreurs.length > 0 ? (
                        <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-sm text-gray-700 font-roboto">{row.assignedLivreurs.length} livreur(s)</span>
                        </div>
                    ) : (
                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">Free</span>
                    )}
                    <button
                        onClick={() => handleOpenAssignModal(row)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Assign Livreurs"
                    >
                        <UserPlus className="w-3.5 h-3.5" />
                    </button>
                </div>
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
                title="Trucks Management"
                subtitle={`Total: ${trucks.length} trucks | Free: ${trucks.filter(t => t.assignedLivreurs.length === 0).length}`}
            />

            <div className="p-6">
                <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex-1 max-w-xs">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    placeholder="Search Trucks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-roboto w-full bg-white"
                                />
                            </div>

                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filterFree}
                                    onChange={(e) => setFilterFree(e.target.checked)}
                                    className="w-4 h-4 text-red-600 focus:ring-red-600 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700 font-roboto">Show Free Only</span>
                            </label>

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
                            Add Truck
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm">
                    <DataTable
                        columns={columns}
                        data={filteredTrucks}
                        loading={loading}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                    />

                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-xs text-gray-600 font-roboto">
                            Rows per page: 10
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-600 font-roboto">1-10 of {filteredTrucks.length}</span>
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

            {/* Truck Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingTruck ? 'Edit Truck' : 'Add New Truck'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="model" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                            Model *
                        </label>
                        <input
                            type="text"
                            id="model"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            className={`w-full px-3 py-2 text-sm border ${errors.model ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                            placeholder="e.g., Mercedes Actros"
                        />
                        {errors.model && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.model}</p>}
                    </div>

                    <div>
                        <label htmlFor="matricule" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                            Matricule *
                        </label>
                        <input
                            type="text"
                            id="matricule"
                            value={formData.matricule}
                            onChange={(e) => setFormData({ ...formData, matricule: e.target.value.toUpperCase() })}
                            className={`w-full px-3 py-2 text-sm border ${errors.matricule ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                            placeholder="e.g., MAT-1234-A"
                        />
                        {errors.matricule && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.matricule}</p>}
                    </div>

                    <div>
                        <label htmlFor="maxTon" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                            Max Capacity (tons) *
                        </label>
                        <input
                            type="number"
                            id="maxTon"
                            value={formData.maxTon}
                            onChange={(e) => setFormData({ ...formData, maxTon: parseFloat(e.target.value) })}
                            step="0.1"
                            min="0"
                            className={`w-full px-3 py-2 text-sm border ${errors.maxTon ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                            placeholder="e.g., 12"
                        />
                        {errors.maxTon && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.maxTon}</p>}
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                            Type *
                        </label>
                        <select
                            id="type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white"
                        >
                            {truckTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
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
                            {editingTruck ? 'Update' : 'Create'} Truck
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Assign Livreurs Modal */}
            <Modal
                isOpen={isAssignModalOpen}
                onClose={handleCloseAssignModal}
                title={`Assign Livreurs to ${selectedTruck?.matricule}`}
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 font-roboto">
                        Select one or more livreurs to assign to this truck
                    </p>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {availableLivreurs.map((livreur) => (
                            <label
                                key={livreur.id}
                                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedLivreurs.includes(livreur.id)}
                                    onChange={() => toggleLivreurSelection(livreur.id)}
                                    className="w-4 h-4 text-red-600 focus:ring-red-600 rounded"
                                />
                                <span className="ml-3 text-sm text-gray-900 font-roboto">{livreur.name}</span>
                            </label>
                        ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-gray-700 font-roboto">
                            <strong className="font-nunito">Selected:</strong> {selectedLivreurs.length} livreur(s)
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleCloseAssignModal}
                            className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-all"
                            style={{ borderRadius: '25px' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleAssignLivreurs}
                            className="px-4 py-2 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all"
                            style={{ borderRadius: '25px' }}
                        >
                            Assign Livreurs
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Trucks;
