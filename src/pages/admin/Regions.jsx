import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Header } from '../../components/Header';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { useRegionStore } from '../../store/regionStore';
import { useFilialeStore } from '../../store/filialeStore';

const Regions = () => {
  const { regions, loading, filters, setFilters, fetchRegions, createRegion, updateRegion, deleteRegion } = useRegionStore();
  const { filiales, fetchFiliales } = useFilialeStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    filialeId: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchRegions();
    fetchFiliales();
  }, [filters]);

  const handleSearch = (e) => {
    setFilters({ search: e.target.value });
  };

  const handleFilialeFilter = (e) => {
    setFilters({ filialeId: e.target.value ? parseInt(e.target.value) : null });
  };

  const handleOpenModal = (region = null) => {
    if (region) {
      setEditingRegion(region);
      setFormData({
        name: region.name,
        filialeId: region.filialeId
      });
    } else {
      setEditingRegion(null);
      setFormData({ name: '', filialeId: '' });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRegion(null);
    setFormData({ name: '', filialeId: '' });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Region name is required';
    }
    
    if (!formData.filialeId) {
      newErrors.filialeId = 'Filiale is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const data = {
        ...formData,
        filialeId: parseInt(formData.filialeId)
      };

      if (editingRegion) {
        await updateRegion(editingRegion.id, data);
      } else {
        await createRegion(data);
      }
      handleCloseModal();
      fetchRegions();
    } catch (error) {
      console.error('Error saving region:', error);
    }
  };

  const handleDelete = async (region) => {
    if (window.confirm(`Are you sure you want to delete ${region.name}?`)) {
      try {
        await deleteRegion(region.id);
        fetchRegions();
      } catch (error) {
        console.error('Error deleting region:', error);
      }
    }
  };

  const columns = [
    {
      header: 'Region ID',
      accessor: 'id',
      render: (row) => (
        <div className="text-xs font-medium text-indigo-600">REG{String(row.id).padStart(4, '0')}</div>
      )
    },
    {
      header: 'Region Name',
      accessor: 'name',
      render: (row) => (
        <div className="font-medium text-gray-900 text-sm">{row.name}</div>
      )
    },
    {
      header: 'Filiale',
      accessor: 'filialeName',
      render: (row) => (
        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
          {row.filialeName}
        </span>
      )
    },
    {
      header: 'Created Date',
      accessor: 'createdAt',
      render: (row) => (
        <div className="text-gray-600 text-sm">{row.createdAt}</div>
      )
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header 
        title="Regions Management"
        subtitle={`Total: ${regions.length} regions`}
      />

      <div className="p-6">
        {/* Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Regions..."
                  value={filters.search}
                  onChange={handleSearch}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-roboto w-full bg-white"
                />
              </div>

              {/* Filiale Filter */}
              <select 
                value={filters.filialeId || ''}
                onChange={handleFilialeFilter}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white text-gray-700"
              >
                <option value="">All Filiales</option>
                {filiales.map((filiale) => (
                  <option key={filiale.id} value={filiale.id}>
                    {filiale.name}
                  </option>
                ))}
              </select>

              {/* Filter Button */}
              <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-roboto flex items-center">
                <Filter className="w-4 h-4 mr-1.5" />
                Filter
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all flex items-center"
              style={{ borderRadius: '25px' }}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Region
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm">
          <DataTable
            columns={columns}
            data={regions}
            loading={loading}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <div className="text-xs text-gray-600 font-roboto">
              Rows per page: 10
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-600 font-roboto">1-10 of {regions.length}</span>
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRegion ? 'Edit Region' : 'Add New Region'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
              Region Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 text-sm border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
              placeholder="Enter region name"
            />
            {errors.name && (
              <p className="text-red-600 text-xs mt-1 font-roboto">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="filialeId" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
              Filiale *
            </label>
            <select
              id="filialeId"
              value={formData.filialeId}
              onChange={(e) => setFormData({ ...formData, filialeId: e.target.value })}
              className={`w-full px-3 py-2 text-sm border ${errors.filialeId ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
            >
              <option value="">Select a filiale</option>
              {filiales.map((filiale) => (
                <option key={filiale.id} value={filiale.id}>
                  {filiale.name} ({filiale.country})
                </option>
              ))}
            </select>
            {errors.filialeId && (
              <p className="text-red-600 text-xs mt-1 font-roboto">{errors.filialeId}</p>
            )}
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
              className="px-4 py-2 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all"
              style={{ borderRadius: '25px' }}
            >
              {editingRegion ? 'Update' : 'Create'} Region
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Regions;
