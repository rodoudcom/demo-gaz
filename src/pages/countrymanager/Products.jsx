import React, { useState } from 'react';
import { Plus, Search, Filter, Image as ImageIcon, Edit2, Trash2, Upload, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Header } from '../../components/Header';
import { Modal } from '../../components/Modal';

const Products = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Bouteille Gaz 13kg',
      description: 'Bouteille de gaz butane standard 13kg',
      minOrderQty: 10,
      defaultPrice: 25.00,
      photos: [],
      variantOptions: [
        { name: 'Type', values: ['Standard', 'Premium'] }
      ],
      variants: [
        { id: 1, combination: 'Standard', sku: 'BG13-STD', price: 25.00, enabled: true, photos: [] },
        { id: 2, combination: 'Premium', sku: 'BG13-PRM', price: 28.00, enabled: true, photos: [] }
      ]
    },
    {
      id: 2,
      name: 'Bouteille Gaz 6kg',
      description: 'Petite bouteille de gaz propane 6kg',
      minOrderQty: 5,
      defaultPrice: 15.00,
      photos: [],
      variantOptions: [
        { name: 'Color', values: ['Red', 'Blue'] },
        { name: 'Size', values: ['L', 'XL'] }
      ],
      variants: [
        { id: 3, combination: 'Red / L', sku: 'BG6-RED-L', price: null, enabled: true, photos: [] },
        { id: 4, combination: 'Red / XL', sku: 'BG6-RED-XL', price: 16.00, enabled: true, photos: [] },
        { id: 5, combination: 'Blue / L', sku: 'BG6-BLUE-L', price: null, enabled: true, photos: [] },
        { id: 6, combination: 'Blue / XL', sku: 'BG6-BLUE-XL', price: 16.00, enabled: true, photos: [] }
      ]
    }
  ]);

  const [expandedProducts, setExpandedProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVariantSetupModalOpen, setIsVariantSetupModalOpen] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingVariant, setEditingVariant] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minOrderQty: 1,
    defaultPrice: 0,
    photos: []
  });

  const [variantOptions, setVariantOptions] = useState([
    { name: '', values: [] }
  ]);
  const [currentOptionValue, setCurrentOptionValue] = useState('');

  const [variantFormData, setVariantFormData] = useState({
    combination: '',
    sku: '',
    price: '',
    enabled: true,
    photos: []
  });

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Toggle product expand/collapse
  const toggleProduct = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };



  const handlePhotoUpload = (e, type = 'product') => {
    const files = Array.from(e.target.files);
    const photoUrls = files.map(file => URL.createObjectURL(file));
    
    if (type === 'product') {
      setFormData({ ...formData, photos: [...formData.photos, ...photoUrls] });
    } else {
      setVariantFormData({ ...variantFormData, photos: [...variantFormData.photos, ...photoUrls] });
    }
  };

  const removePhoto = (index, type = 'product') => {
    if (type === 'product') {
      setFormData({ ...formData, photos: formData.photos.filter((_, i) => i !== index) });
    } else {
      setVariantFormData({ ...variantFormData, photos: variantFormData.photos.filter((_, i) => i !== index) });
    }
  };

  const addVariantOption = () => {
    setVariantOptions([...variantOptions, { name: '', values: [] }]);
  };

  const removeVariantOption = (index) => {
    setVariantOptions(variantOptions.filter((_, i) => i !== index));
  };

  const updateVariantOptionName = (index, name) => {
    const updated = [...variantOptions];
    updated[index].name = name;
    setVariantOptions(updated);
  };

  const addVariantOptionValue = (index) => {
    if (currentOptionValue.trim()) {
      const updated = [...variantOptions];
      updated[index].values.push(currentOptionValue.trim());
      setVariantOptions(updated);
      setCurrentOptionValue('');
    }
  };

  const removeVariantOptionValue = (optionIndex, valueIndex) => {
    const updated = [...variantOptions];
    updated[optionIndex].values = updated[optionIndex].values.filter((_, i) => i !== valueIndex);
    setVariantOptions(updated);
  };

  const generateVariantCombinations = () => {
    const validOptions = variantOptions.filter(opt => opt.name && opt.values.length > 0);
    
    if (validOptions.length === 0) return [];

    const combinations = [];
    
    const generate = (current, depth) => {
      if (depth === validOptions.length) {
        combinations.push(current.join(' / '));
        return;
      }
      
      for (const value of validOptions[depth].values) {
        generate([...current, value], depth + 1);
      }
    };

    generate([], 0);
    return combinations;
  };

  const handleOpenVariantSetup = (product) => {
    setSelectedProduct(product);
    if (product.variantOptions) {
      setVariantOptions(product.variantOptions);
    } else {
      setVariantOptions([{ name: '', values: [] }]);
    }
    setIsVariantSetupModalOpen(true);
  };

  const handleSaveVariantSetup = () => {
    const combinations = generateVariantCombinations();
    const newVariants = combinations.map((combo, index) => ({
      id: Date.now() + index,
      combination: combo,
      sku: '',
      price: null,
      enabled: true,
      photos: []
    }));

    const updatedProducts = products.map(p => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          variantOptions: variantOptions.filter(opt => opt.name && opt.values.length > 0),
          variants: newVariants
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    setExpandedProducts({ ...expandedProducts, [selectedProduct.id]: true });
    setIsVariantSetupModalOpen(false);
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        minOrderQty: product.minOrderQty,
        defaultPrice: product.defaultPrice || 0,
        photos: product.photos || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        minOrderQty: 1,
        defaultPrice: 0,
        photos: []
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setErrors({});
  };

  const handleOpenVariantModal = (product, variant = null) => {
    setSelectedProduct(product);
    if (variant) {
      setEditingVariant(variant);
      setVariantFormData({
        combination: variant.combination,
        sku: variant.sku,
        price: variant.price !== null ? variant.price : '',
        enabled: variant.enabled,
        photos: variant.photos || []
      });
    }
    setIsVariantModalOpen(true);
  };

  const handleCloseVariantModal = () => {
    setIsVariantModalOpen(false);
    setSelectedProduct(null);
    setEditingVariant(null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.minOrderQty < 1) newErrors.minOrderQty = 'Minimum order quantity must be at least 1';
    if (formData.defaultPrice < 0) newErrors.defaultPrice = 'Default price cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVariantForm = () => {
    const newErrors = {};
    
    if (!variantFormData.sku.trim()) newErrors.sku = 'SKU is required';
    if (variantFormData.price !== '' && variantFormData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
          variantOptions: [],
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
          return {
            ...p,
            variants: p.variants.map(v => 
              v.id === editingVariant.id 
                ? { ...v, ...variantFormData, price: variantFormData.price === '' ? null : parseFloat(variantFormData.price) }
                : v
            )
          };
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
    if (window.confirm(`Are you sure you want to delete variant ${variant.combination}?`)) {
      const updatedProducts = products.map(p => {
        if (p.id === product.id) {
          return { ...p, variants: p.variants.filter(v => v.id !== variant.id) };
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

        {/* Products List with Collapse */}
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Product Header - Clickable to expand/collapse */}
              <div 
                className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleProduct(product.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  {/* Expand/Collapse Icon */}
                  <button className="text-gray-400 hover:text-gray-600">
                    {expandedProducts[product.id] ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {product.photos && product.photos.length > 0 ? (
                      <img src={product.photos[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 font-nunito">{product.name}</h3>
                    <p className="text-xs text-gray-600 font-roboto">{product.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-gray-500 font-roboto">Min. Order: {product.minOrderQty} units</p>
                      <p className="text-xs text-gray-500 font-roboto">•</p>
                      <p className="text-xs font-semibold text-gray-900 font-roboto">Default: €{product.defaultPrice.toFixed(2)}</p>
                      {product.variants && product.variants.length > 0 && (
                        <>
                          <p className="text-xs text-gray-500 font-roboto">•</p>
                          <p className="text-xs text-blue-600 font-roboto">{product.variants.length} variants</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleOpenVariantSetup(product)}
                    className="px-3 py-1.5 bg-purple-50 text-purple-600 text-xs font-medium hover:bg-purple-100 transition-all"
                    style={{ borderRadius: '25px' }}
                  >
                    <Plus className="w-3 h-3 inline mr-1" />
                    Setup Variants
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

              {/* Variants Table - Only show when expanded */}
              {expandedProducts[product.id] && product.variants && product.variants.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase font-nunito">Photo</th>
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
                          <td className="px-4 py-3">
                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                              {variant.photos && variant.photos.length > 0 ? (
                                <img src={variant.photos[0]} alt={variant.combination} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 font-roboto">{variant.combination}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 font-roboto">{variant.sku || '-'}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900 font-roboto">
                            {variant.price !== null && variant.price !== undefined && variant.price !== '' ? (
                              `€${variant.price.toFixed(2)}`
                            ) : (
                              <span className="text-gray-500">€{product.defaultPrice.toFixed(2)} <span className="text-xs">(default)</span></span>
                            )}
                          </td>
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

      {/* Product Modal - Add Default Price field */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
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
              {errors.name && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.name}</p>}
            </div>

            <div className="col-span-2">
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
              {errors.description && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.description}</p>}
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
              {errors.minOrderQty && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.minOrderQty}</p>}
            </div>

            <div>
              <label htmlFor="defaultPrice" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                Default Price (€) *
              </label>
              <input
                type="number"
                id="defaultPrice"
                value={formData.defaultPrice}
                onChange={(e) => setFormData({ ...formData, defaultPrice: parseFloat(e.target.value) })}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 text-sm border ${errors.defaultPrice ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                placeholder="0.00"
              />
              {errors.defaultPrice && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.defaultPrice}</p>}
              <p className="text-xs text-gray-500 mt-1 font-roboto">Used when variant has no specific price</p>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
              Product Photos
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-600 transition-colors">
                <Upload className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 font-roboto">Click to upload photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 'product')}
                  className="hidden"
                />
              </label>
              
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img src={photo} alt={`Product ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removePhoto(index, 'product')}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              {editingProduct ? 'Update' : 'Create'} Product
            </button>
          </div>
        </form>
      </Modal>

      {/* Variant Setup Modal - same as before but updated for null price support */}
      {/* Variant Edit Modal - Update to allow empty price */}
      <Modal
        isOpen={isVariantModalOpen}
        onClose={handleCloseVariantModal}
        title={`Edit Variant: ${variantFormData.combination}`}
        size="md"
      >
        <form onSubmit={handleVariantSubmit} className="space-y-4">
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
              placeholder="e.g., BG13-RED-L"
            />
            {errors.sku && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.sku}</p>}
          </div>

          <div>
            <label htmlFor="price" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
              Price (€)
            </label>
            <input
              type="number"
              id="price"
              value={variantFormData.price}
              onChange={(e) => setVariantFormData({ ...variantFormData, price: e.target.value })}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 text-sm border ${errors.price ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
              placeholder="Leave empty to use default price"
            />
            {errors.price && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.price}</p>}
            <p className="text-xs text-gray-500 mt-1 font-roboto">
              Leave empty to use product default price (€{selectedProduct?.defaultPrice.toFixed(2)})
            </p>
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

          {/* Photo Upload for Variant */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
              Variant Photos
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-600 transition-colors">
                <Upload className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 font-roboto">Click to upload photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 'variant')}
                  className="hidden"
                />
              </label>
              
              {variantFormData.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {variantFormData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img src={photo} alt={`Variant ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removePhoto(index, 'variant')}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              Update Variant
            </button>
          </div>
        </form>
      </Modal>

      {/* Variant Setup Modal (Create Combinations) */}
      <Modal
        isOpen={isVariantSetupModalOpen}
        onClose={() => setIsVariantSetupModalOpen(false)}
        title="Setup Product Variants"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 font-roboto">
            Define variant options (e.g., Color, Size) and their values. Combinations will be generated automatically.
          </p>

          {variantOptions.map((option, optionIndex) => (
            <div key={optionIndex} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={option.name}
                  onChange={(e) => updateVariantOptionName(optionIndex, e.target.value)}
                  placeholder="Option name (e.g., Color, Size)"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white"
                />
                <button
                  type="button"
                  onClick={() => removeVariantOption(optionIndex)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={currentOptionValue}
                  onChange={(e) => setCurrentOptionValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addVariantOptionValue(optionIndex);
                    }
                  }}
                  placeholder="Add value (e.g., Red, Blue)"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white"
                />
                <button
                  type="button"
                  onClick={() => addVariantOptionValue(optionIndex)}
                  className="px-3 py-2 bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-all rounded-lg"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {option.values.map((value, valueIndex) => (
                  <span key={valueIndex} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-roboto rounded-full flex items-center gap-1">
                    {value}
                    <button
                      type="button"
                      onClick={() => removeVariantOptionValue(optionIndex, valueIndex)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addVariantOption}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all rounded-lg"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Add Option
          </button>

          {/* Preview Combinations */}
          {generateVariantCombinations().length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 font-nunito">
                Preview: {generateVariantCombinations().length} combinations will be generated
              </h4>
              <div className="flex flex-wrap gap-2">
                {generateVariantCombinations().slice(0, 10).map((combo, index) => (
                  <span key={index} className="px-2 py-1 bg-white text-gray-700 text-xs font-roboto rounded border border-blue-200">
                    {combo}
                  </span>
                ))}
                {generateVariantCombinations().length > 10 && (
                  <span className="px-2 py-1 text-gray-500 text-xs font-roboto">
                    +{generateVariantCombinations().length - 10} more...
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsVariantSetupModalOpen(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-all"
              style={{ borderRadius: '25px' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveVariantSetup}
              className="px-4 py-2 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all"
              style={{ borderRadius: '25px' }}
            >
              Generate Variants
            </button>
          </div>
        </div>
      </Modal>


      {/* Keep the Variant Setup Modal from previous version */}
    </div>
  );
};

export default Products;
