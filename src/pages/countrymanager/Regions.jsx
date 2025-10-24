import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Image as ImageIcon, Edit2, Trash2 } from 'lucide-react';
import { Header } from '../../components/Header';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';

const Products = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Bouteille Gaz 13kg',
      description: 'Bouteille de gaz butane standard 13kg',
      minOrderQty: 10,
      variants: [
        { id: 1, name: 'Standard', sku: 'BG13-STD', price: 25.00, enabled: true, photos: [] },
        { id: 2, name: 'Premium', sku: 'BG13-PRM', price: 28.00, enabled: true, photos: [] }
      ]
    },
    {
      id: 2,
      name: 'Bouteille Gaz 6kg',
      description: 'Petite bouteille de gaz propane 6kg',
      minOrderQty: 5,
      variants: [
        { id: 3, name: 'Standard', sku: 'BG6-STD', price: 15.00, enabled: true, photos: [] }
      ]
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingVariant, setEditingVariant] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minOrderQty: 1,
    photos: []
  });

  const [variantFormData, setVariantFormData] = useState({
    name: '',
    sku: '',
    price: '',
    enabled: true,
    photos: []
  });

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        minOrderQty: product.minOrderQty,
        photos: product.photos || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        minOrderQty: 1,
        photos: []
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      minOrderQty: 1,
      photos: []
    });
    setErrors({});
  };

  const handleOpenVariantModal = (product, variant = null) => {
    setSelectedProduct(product);
    if (variant) {
      setEditingVariant(variant);
      setVariantFormData({
        name: variant.name,
        sku: variant.sku,
        price: variant.price,
        enabled: variant.enabled,
        photos: variant.photos || []
      });
    } else {
      setEditingVariant(null);
      setVariantFormData({
        name: '',
        sku: '',
        price: '',
        enabled: true,
        photos: []
      });
    }
    setIsVariantModalOpen(true);
  };

  const handleCloseVariantModal = () => {
    setIsVariantModalOpen(false);
    setSelectedProduct(null);
    setEditingVariant(null);
    setVariantFormData({
      name: '',
      sku: '',
      price: '',
      enabled: true,
      photos: []
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.minOrderQty < 1) {
      newErrors.minOrderQty = 'Minimum order quantity must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVariantForm = () => {
    const newErrors = {};
    
    if (!variantFormData.name.trim()) {
      newErrors.name = 'Variant name is required';
    }
    
    if (!variantFormData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
    
    if (!variantFormData.price || variantFormData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      if (editingProduct) {
        setProducts(products.map(p => 
          p.id === editingProduct.id ? { ...p, ...formData } : p
        ));
      } else {
        const newProduct = {
          id: products.length + 1,
          ...formData,
          variants: []
        };
        setProducts([...products, newProduct]);
      }
      setLoading(false);
      handleCloseModal();
    }, 500);
  };

  const handleVariantSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateVariantForm()) return;

    setLoading(true);
    setTimeout(() => {
      const updatedProducts = products.map(p => {
        if (p.id === selectedProduct.id) {
          if (editingVariant) {
            return {
              ...p,
              variants: p.variants.map(v => 
                v.id === editingVariant.id ? { ...v, ...variantFormData } : v
              )
            };
          } else {
            return {
              ...p,
              variants: [...p.variants, { id: Date.now(), ...variantFormData }]
            };
          }
        }
        return p;
      });
      setProducts(updatedProducts);
      setLoading(false);
      handleCloseVariantModal();
    }, 500);
  };

  const handleDelete = (product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      setProducts(products.filter(p => p.id !== product.id));
    }
  };

  const handleDeleteVariant = (product, variant) => {
    if (window.confirm(`Are you sure you want to delete variant ${variant.name}?`)) {
      const updatedProducts = products.map(p => {
        if (p.id === product.id) {
          return {
            ...p,
            variants: p.variants.filter(v => v.id !== variant.id)
          };
        }
        return p;
      });
      setProducts(updatedProducts);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header 
        title="Products Management"
        subtitle={`Total: ${products.length} products`}
      />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Products..."
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
              Add Product
            </button>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Product Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 font-nunito">{product.name}</h3>
                      <p className="text-xs text-gray-600 font-roboto">{product.description}</p>
                      <p className="text-xs text-gray-500 mt-1 font-roboto">Min. Order: {product.minOrderQty} units</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenVariantModal(product)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-all"
                    style={{ borderRadius: '25px' }}
                  >
                    <Plus className="w-3 h-3 inline mr-1" />
                    Add Variant
                  </button>
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Variants Table */}
              {product.variants.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase font-nunito">Variant</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase font-nunito">SKU</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase font-nunito">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase font-nunito">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase font-nunito">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {product.variants.map((variant) => (
                        <tr key={variant.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 font-roboto">{variant.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 font-roboto">{variant.sku}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900 font-roboto">€{variant.price.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              variant.enabled ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {variant.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenVariantModal(product, variant)}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteVariant(product, variant)}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 text-sm border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
              placeholder="e.g., Bouteille Gaz 13kg"
            />
            {errors.name && (
              <p className="text-red-600 text-xs mt-1 font-roboto">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className={`w-full px-3 py-2 text-sm border ${errors.description ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
              placeholder="Product description"
            />
            {errors.description && (
              <p className="text-red-600 text-xs mt-1 font-roboto">{errors.description}</p>
            )}
          </div>

          <div>
            <label htmlFor="minOrderQty" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
              Minimum Order Quantity *
            </label>
            <input
              type="number"
              id="minOrderQty"
              value={formData.minOrderQty}
              onChange={(e) => setFormData({ ...formData, minOrderQty: parseInt(e.target.value) })}
              min="1"
              className={`w-full px-3 py-2 text-sm border ${errors.minOrderQty ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
            />
            {errors.minOrderQty && (
              <p className="text-red-600 text-xs mt-1 font-roboto">{errors.minOrderQty}</p>
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
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all"
              style={{ borderRadius: '25px' }}
            >
              {editingProduct ? 'Update' : 'Create'} Product
            </button>
          </div>
        </form>
      </Modal>

      {/* Variant Modal */}
      <Modal
        isOpen={isVariantModalOpen}
        onClose={handleCloseVariantModal}
        title={editingVariant ? 'Edit Variant' : 'Add New Variant'}
        size="md"
      >
        <form onSubmit={handleVariantSubmit} className="space-y-4">
          <div>
            <label htmlFor="variantName" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
              Variant Name *
            </label>
            <input
              type="text"
              id="variantName"
              value={variantFormData.name}
              onChange={(e) => setVariantFormData({ ...variantFormData, name: e.target.value })}
              className={`w-full px-3 py-2 text-sm border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
              placeholder="e.g., Standard, Premium"
            />
            {errors.name && (
              <p className="text-red-600 text-xs mt-1 font-roboto">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="sku" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
              SKU *
            </label>
            <input
              type="text"
              id="sku"
              value={variantFormData.sku}
              onChange={(e) => setVariantFormData({ ...variantFormData, sku: e.target.value })}
              className={`w-full px-3 py-2 text-sm border ${errors.sku ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
              placeholder="e.g., BG13-STD"
            />
            {errors.sku && (
              <p className="text-red-600 text-xs mt-1 font-roboto">{errors.sku}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
              Price (€) *
            </label>
            <input
              type="number"
              id="price"
              value={variantFormData.price}
              onChange={(e) => setVariantFormData({ ...variantFormData, price: parseFloat(e.target.value) })}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 text-sm border ${errors.price ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-red-600 text-xs mt-1 font-roboto">{errors.price}</p>
            )}
          </div>

          <div>
            <label htmlFor="enabled" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
              Status
            </label>
            <select
              id="enabled"
              value={variantFormData.enabled.toString()}
              onChange={(e) => setVariantFormData({ ...variantFormData, enabled: e.target.value === 'true' })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleCloseVariantModal}
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
              {editingVariant ? 'Update' : 'Create'} Variant
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
