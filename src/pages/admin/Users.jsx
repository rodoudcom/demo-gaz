import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Header } from '../../components/Header';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { useUserStore } from '../../store/userStore';
import { useFilialeStore } from '../../store/filialeStore';

const Users = () => {
  const { users, loading, filters, setFilters, fetchUsers, createUser, updateUser, deleteUser } = useUserStore();
  const { filiales, fetchFiliales } = useFilialeStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    role: '',
    filialeId: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  const roles = ['Admin', 'Country Manager'];

  useEffect(() => {
    setFilters({ restrictRoles: true });
    fetchUsers();
    fetchFiliales();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleSearch = (e) => {
    setFilters({ search: e.target.value });
  };

  const handleRoleFilter = (e) => {
    setFilters({ role: e.target.value });
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        fullname: user.fullname,
        email: user.email,
        password: '',
        role: user.role,
        filialeId: user.filialeId || '',
        isActive: user.isActive
      });
    } else {
      setEditingUser(null);
      setFormData({
        fullname: '',
        email: '',
        password: '',
        role: '',
        filialeId: '',
        isActive: true
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      fullname: '',
      email: '',
      password: '',
      role: '',
      filialeId: '',
      isActive: true
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!editingUser && !formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
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
        filialeId: formData.filialeId ? parseInt(formData.filialeId) : null
      };

      if (editingUser) {
        const updateData = { ...data };
        if (!updateData.password) delete updateData.password;
        await updateUser(editingUser.id, updateData);
      } else {
        await createUser(data);
      }
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.fullname}?`)) {
      try {
        await deleteUser(user.id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const columns = [
    {
      header: 'Employee Number',
      accessor: 'id',
      render: (row) => (
        <div className="text-xs font-medium text-indigo-600">PLG{String(row.id).padStart(4, '0')}</div>
      )
    },
    {
      header: 'Name',
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
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
          {row.role}
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
        title="User Management"
        subtitle={`Total: ${users.length} users`}
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
                  placeholder="Search User..."
                  value={filters.search}
                  onChange={handleSearch}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-roboto w-full bg-white"
                />
              </div>

              {/* Role Filter */}
              <select 
                value={filters.role}
                onChange={handleRoleFilter}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white text-gray-700"
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              {/* Filter Button */}
              <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-roboto flex items-center">
                <Filter className="w-4 h-4 mr-1.5" />
                Filter
              </button>
            </div>

            {/* Add Button - Smaller */}
            <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all flex items-center"
            style={{ borderRadius: '25px' }}
            >
            <Plus className="w-4 h-4 mr-1.5" />
            Add User
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm">
          <DataTable
            columns={columns}
            data={users}
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
              <span className="text-xs text-gray-600 font-roboto">1-10 of {users.length}</span>
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
        title={editingUser ? 'Edit User' : 'Add New User'}
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
              {errors.fullname && (
                <p className="text-red-600 text-xs mt-1 font-roboto">{errors.fullname}</p>
              )}
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
              {errors.email && (
                <p className="text-red-600 text-xs mt-1 font-roboto">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                Password {!editingUser && '*'}
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-3 py-2 text-sm border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'}
              />
              {errors.password && (
                <p className="text-red-600 text-xs mt-1 font-roboto">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                Role *
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={`w-full px-3 py-2 text-sm border ${errors.role ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-red-600 text-xs mt-1 font-roboto">{errors.role}</p>
              )}
            </div>

            <div>
              <label htmlFor="filialeId" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                Filiale
              </label>
              <select
                id="filialeId"
                value={formData.filialeId}
                onChange={(e) => setFormData({ ...formData, filialeId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white"
              >
                <option value="">All Filiales</option>
                {filiales.map((filiale) => (
                  <option key={filiale.id} value={filiale.id}>
                    {filiale.name}
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
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
{/* In the Modal - Cancel Button */}
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
  {editingUser ? 'Update' : 'Create'} User
</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
