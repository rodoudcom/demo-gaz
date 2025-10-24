import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronRight, Edit2 } from 'lucide-react';
import { Header } from '../../components/Header';
import { Modal } from '../../components/Modal';

const Products = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'Bouteille Gaz 13kg',
            defaultPrice: 25.00,
            variants: [
                { id: 1, combination: 'Standard', sku: 'BG13-STD', basePrice: 25.00, distributorPrice: 26.50, inStock: true },
                { id: 2, combination: 'Premium', sku: 'BG13-PRM', basePrice: 28.00, distributorPrice: null, inStock: true }
            ]
        },
        {
            id: 2,
            name: 'Bouteille Gaz 6kg',
            defaultPrice: 15.00,
            variants: [
                { id: 3, combination: 'Red / L', sku: 'BG6-RED-L', basePrice: 15.00, distributorPrice: 16.00, inStock: true },
                { id: 4, combination: 'Red / XL', sku: 'BG6-RED-XL', basePrice: 16.00, distributorPrice: null, inStock: false },
                { id: 5, combination: 'Blue / L', sku: 'BG6-BLUE-L', basePrice: 15.00, distributorPrice: 15.80, inStock: true },
                { id: 6, combination: 'Blue / XL', sku: 'BG6-BLUE-XL', basePrice: 16.00, distributorPrice: null, inStock: true }
            ]
        }
    ]);

    const [expandedProducts, setExpandedProducts] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        distributorPrice: '',
        inStock: true
    });

    const [errors, setErrors] = useState({});

    const toggleProduct = (productId) => {
        setExpandedProducts(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    const getEffectivePrice = (variant, product) => {
        return variant.distributorPrice !== null && variant.distributorPrice !== undefined
            ? variant.distributorPrice
            : (variant.basePrice || product.defaultPrice);
    };

    const handleOpenModal = (product, variant) => {
        setSelectedProduct(product);
        setEditingVariant(variant);
        setFormData({
            distributorPrice: variant.distributorPrice !== null ? variant.distributorPrice : '',
            inStock: variant.inStock
        });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingVariant(null);
        setSelectedProduct(null);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (formData.distributorPrice !== '' && (isNaN(formData.distributorPrice) || formData.distributorPrice < 0)) {
            newErrors.distributorPrice = 'Price must be a valid number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const updatedProducts = products.map(p => {
            if (p.id === selectedProduct.id) {
                return {
                    ...p,
                    variants: p.variants.map(v =>
                        v.id === editingVariant.id
                            ? {
                                ...v,
                                distributorPrice: formData.distributorPrice === '' ? null : parseFloat(formData.distributorPrice),
                                inStock: formData.inStock
                            }
                            : v
                    )
                };
            }
            return p;
        });

        setProducts(updatedProducts);
        handleCloseModal();
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header
                title="Products Management"
                subtitle="Manage your specific prices and stock availability"
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
                    </div>
                </div>

                {/* Products List with Collapse */}
                <div className="space-y-4">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {/* Product Header */}
                            <div
                                className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                                onClick={() => toggleProduct(product.id)}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <button className="text-gray-400 hover:text-gray-600">
                                        {expandedProducts[product.id] ? (
                                            <ChevronDown className="w-5 h-5" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5" />
                                        )}
                                    </button>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 font-nunito">{product.name}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-xs font-semibold text-gray-900 font-roboto">Base: €{product.defaultPrice.toFixed(2)}</p>
                                            {product.variants && product.variants.length > 0 && (
                                                <>
                                                    <p className="text-xs text-gray-500 font-roboto">•</p>
                                                    <p className="text-xs text-blue-600 font-roboto">{product.variants.length} variants</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Variants Table */}
                            {expandedProducts[product.id] && product.variants && product.variants.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase font-nunito">Variant</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase font-nunito">SKU</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase font-nunito">Base Price</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase font-nunito">Your Price</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase font-nunito">In Stock</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase font-nunito">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                        {product.variants.map((variant) => (
                                            <tr key={variant.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900 font-roboto">{variant.combination}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600 font-roboto">{variant.sku}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700 font-roboto">
                                                    €{(variant.basePrice || product.defaultPrice).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-semibold font-roboto">
                                                    {variant.distributorPrice !== null && variant.distributorPrice !== undefined ? (
                                                        <span className="text-red-600">€{variant.distributorPrice.toFixed(2)}</span>
                                                    ) : (
                                                        <span className="text-gray-500">€{(variant.basePrice || product.defaultPrice).toFixed(2)} <span className="text-xs">(base)</span></span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                                variant.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {variant.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => handleOpenModal(product, variant)}
                                                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
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

            {/* Edit Variant Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={`Edit: ${editingVariant?.combination}`}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-xs text-gray-700 font-roboto">
                            <strong className="font-nunito">Base Price:</strong> €{editingVariant?.basePrice || selectedProduct?.defaultPrice}
                        </p>
                        <p className="text-xs text-gray-600 font-roboto mt-1">
                            Leave "Your Price" empty to use the base price
                        </p>
                    </div>

                    <div>
                        <label htmlFor="distributorPrice" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                            Your Specific Price (€)
                        </label>
                        <input
                            type="number"
                            id="distributorPrice"
                            value={formData.distributorPrice}
                            onChange={(e) => setFormData({ ...formData, distributorPrice: e.target.value })}
                            step="0.01"
                            min="0"
                            className={`w-full px-3 py-2 text-sm border ${errors.distributorPrice ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white`}
                            placeholder="Leave empty to use base price"
                        />
                        {errors.distributorPrice && <p className="text-red-600 text-xs mt-1 font-roboto">{errors.distributorPrice}</p>}
                    </div>

                    <div>
                        <label htmlFor="inStock" className="block text-xs font-medium text-gray-700 mb-1.5 font-nunito">
                            Stock Availability
                        </label>
                        <select
                            id="inStock"
                            value={formData.inStock.toString()}
                            onChange={(e) => setFormData({ ...formData, inStock: e.target.value === 'true' })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white"
                        >
                            <option value="true">In Stock</option>
                            <option value="false">Out of Stock</option>
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
                            className="px-4 py-2 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all"
                            style={{ borderRadius: '25px' }}
                        >
                            Update Variant
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Products;
