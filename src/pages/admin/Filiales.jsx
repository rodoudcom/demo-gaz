import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Header } from '../../components/Header';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { useFilialeStore } from '../../store/filialeStore';
import { fakeApi } from '../../api/fakeApi';

const Filiales = () => {
  const { filiales, loading, filters, setFilters, fetchFiliales, createFiliale, updateFiliale, deleteFiliale } = useFilialeStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFiliale, setEditingFiliale] = useState(null);
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    country: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchFiliales();
    loadCountries();
  }, [filters]);

  const loadCountries = async () => {
    const data = await fakeApi.countries.getAll();
    setCountries(data);
  };

  const handleSearch = (e) => {
    setFilters({ search: e.target.value });
  };

  const handleCountryFilter = (e) => {
    setFilters({ country: e.target.value });
  };

  const handleOpenModal = (filiale = null) => {
    if (filiale) {
      setEditingFiliale(filiale);
      setFormData({
        name: filiale.name,
        country: filiale.country
      });
    } else {
      setEditingFiliale(null);
      setFormData({ name: '', country: '' });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFiliale(null);
    setFormData({ name: '', country: '' });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Filiale name is required';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (editingFiliale) {
        await updateFiliale(editingFiliale.id, formData);
      } else {
        await createFiliale(formData);
      }
      handleCloseModal();
      fetchFiliales();
    } catch (error) {
      console.error('Error saving filiale:', error);
    }
  };

  const handleDelete = async (filiale) => {
    if (window.confirm(`Are you sure you want to delete ${filiale.name}?`)) {
      try {
        await deleteFiliale(filiale.id);
        fetchFiliales();
      } catch (error) {
        console.error('Error deleting filiale:', error);
      }
    }
  };

  const columns = [
    {
      header: 'Filiale ID',
      accessor: 'id',
      render: (row) => (
        <div className="text-xs font-medium text-indigo-600">FIL{String(row.id).padStart(4, '0')}</div>
      )
    },
    {
      header: 'Filiale Name',
      accessor: 'name',
      render: (row) => (
        <div className="font-medium text-gray-900 text-sm">{row.name}</div>
      )
    },
    {
      header: 'Country',
      accessor: 'country',
      render: (row) => (
        <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
          {row.country}
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
        title="Filiales Management"
        subtitle={`Total: ${filiales.length} filiales`}
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
                  placeholder="Search Filiales..."
                  value={filters.search}
                  onChange={handleSearch}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-roboto w-full bg-white"
                />
              </div>

              {/* Country Filter */}
              <select 
                value={filters.country}
                onChange={handleCountryFilter}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white text-gray-700"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
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
              Add Filiale
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm">
          <DataTable
            columns={columns}
            data={filiales}
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
              <span className="text-xs text-gray-600 font-roboto">1-10 of {filiales.length}</span>
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
        title={editingFiliale ? 'Edit Filiale' : 'Add New Filiale'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
              Filiale Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 text-sm border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
              placeholder="Enter filiale name"
            />
            {errors.name && (
              <p className="text-red-600 text-xs mt-1 font-roboto">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="country" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
              Country *
            </label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className={`w-full px-3 py-2 text-sm border ${errors.country ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-red-600 text-xs mt-1 font-roboto">{errors.country}</p>
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
              {editingFiliale ? 'Update' : 'Create'} Filiale
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Filiales;
