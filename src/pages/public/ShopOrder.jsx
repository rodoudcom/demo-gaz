import React, { useState } from 'react';
import { Search, Plus, Minus, Trash2, Package, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShopOrder = () => {
    const navigate = useNavigate();

    // Mock shop data (in real app, get from auth)
    const shopInfo = {
        name: 'Gas Station Nord',
        code: 'GS-NORD-001',
        address: '123 Avenue Hassan II, Casablanca',
        contact: 'Mohamed Ali'
    };

    // Mock products
    const [availableProducts] = useState([
        {
            id: 1,
            name: 'Bouteille Gaz 13kg',
            variants: [
                { id: 1, name: 'Standard', price: 25.99, inStock: true },
                { id: 2, name: 'Premium', price: 28.99, inStock: true }
            ]
        },
        {
            id: 2,
            name: 'Bouteille Gaz 6kg',
            variants: [
                { id: 3, name: 'Red / L', price: 15.99, inStock: true },
                { id: 4, name: 'Red / XL', price: 16.99, inStock: false },
                { id: 5, name: 'Blue / L', price: 15.99, inStock: true },
                { id: 6, name: 'Blue / XL', price: 16.99, inStock: true }
            ]
        },
        {
            id: 3,
            name: 'Bouteille Gaz 3kg',
            variants: [
                { id: 7, name: 'Standard', price: 12.99, inStock: true }
            ]
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [orderItems, setOrderItems] = useState([]);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [notes, setNotes] = useState('');

    const deliveryFee = 5.00;
    const freeDeliveryThreshold = 100.00;

    const handleProductSearch = (e) => {
        setSearchTerm(e.target.value);
        setSelectedProduct(null);
        setSelectedVariant(null);
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setSelectedVariant(null);
        setSearchTerm(product.name);
    };

    const handleVariantSelect = (e) => {
        const variantId = parseInt(e.target.value);
        const variant = selectedProduct?.variants.find(v => v.id === variantId);
        setSelectedVariant(variant);
    };

    const handleQuantityChange = (value) => {
        const newQty = Math.max(1, quantity + value);
        setQuantity(newQty);
    };

    const addToOrder = () => {
        if (!selectedProduct || !selectedVariant) {
            alert('Please select a product and variant');
            return;
        }

        const existingItemIndex = orderItems.findIndex(
            item => item.productId === selectedProduct.id && item.variantId === selectedVariant.id
        );

        if (existingItemIndex >= 0) {
            const updatedItems = [...orderItems];
            updatedItems[existingItemIndex].quantity += quantity;
            setOrderItems(updatedItems);
        } else {
            setOrderItems([
                ...orderItems,
                {
                    productId: selectedProduct.id,
                    productName: selectedProduct.name,
                    variantId: selectedVariant.id,
                    variantName: selectedVariant.name,
                    price: selectedVariant.price,
                    quantity: quantity
                }
            ]);
        }

        // Reset selection
        setSearchTerm('');
        setSelectedProduct(null);
        setSelectedVariant(null);
        setQuantity(1);
    };

    const removeFromOrder = (index) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const updateOrderItemQuantity = (index, newQuantity) => {
        if (newQuantity < 1) {
            removeFromOrder(index);
            return;
        }
        const updatedItems = [...orderItems];
        updatedItems[index].quantity = newQuantity;
        setOrderItems(updatedItems);
    };

    const calculateSubtotal = () => {
        return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const delivery = subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;
        return subtotal + delivery;
    };

    const handleSubmitOrder = () => {
        if (orderItems.length === 0) {
            alert('Please add at least one item to your order');
            return;
        }
        if (!deliveryDate) {
            alert('Please select a delivery date');
            return;
        }

        // In real app, submit to API
        console.log('Order submitted:', {
            shop: shopInfo,
            items: orderItems,
            deliveryDate,
            notes,
            subtotal: calculateSubtotal(),
            deliveryFee: calculateSubtotal() >= freeDeliveryThreshold ? 0 : deliveryFee,
            total: calculateTotal()
        });

        // Navigate to success page
        navigate('/order-success');
    };

    const filteredProducts = searchTerm
        ? availableProducts.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const subtotal = calculateSubtotal();
    const actualDeliveryFee = subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;
    const total = calculateTotal();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Shop Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 font-nunito">{shopInfo.name}</h1>
                            <p className="text-sm text-gray-600 font-roboto mt-1">Code: {shopInfo.code}</p>
                            <p className="text-sm text-gray-600 font-roboto">{shopInfo.address}</p>
                            <p className="text-sm text-gray-600 font-roboto">Contact: {shopInfo.contact}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Search */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <label className="block text-sm font-semibold text-gray-900 mb-3 font-nunito">
                                Search Product
                            </label>
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleProductSearch}
                                    placeholder="Search for gas bottles..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 font-roboto"
                                />
                            </div>

                            {/* Search Results */}
                            {searchTerm && filteredProducts.length > 0 && !selectedProduct && (
                                <div className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                                    {filteredProducts.map(product => (
                                        <button
                                            key={product.id}
                                            onClick={() => handleProductSelect(product)}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                                        >
                                            <p className="text-sm font-medium text-gray-900 font-roboto">{product.name}</p>
                                            <p className="text-xs text-gray-500 font-roboto">{product.variants.length} variants available</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Variant Selection */}
                        {selectedProduct && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <label className="block text-sm font-semibold text-gray-900 mb-3 font-nunito">
                                    Select Variant
                                </label>
                                <select
                                    value={selectedVariant?.id || ''}
                                    onChange={handleVariantSelect}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 font-roboto"
                                >
                                    <option value="">Choose a variant</option>
                                    {selectedProduct.variants.map(variant => (
                                        <option key={variant.id} value={variant.id} disabled={!variant.inStock}>
                                            {variant.name} - €{variant.price.toFixed(2)} {!variant.inStock && '(Out of Stock)'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Quantity Selection */}
                        {selectedVariant && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <label className="block text-sm font-semibold text-gray-900 mb-3 font-nunito">
                                    Number of Gas Bottles
                                </label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-colors"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="flex-1 px-4 py-3 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 font-nunito"
                                    />
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <button
                                    onClick={addToOrder}
                                    className="w-full mt-4 px-6 py-3 bg-red-600 text-white font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                    style={{ borderRadius: '25px' }}
                                >
                                    <Plus className="w-5 h-5" />
                                    Add to Order
                                </button>
                            </div>
                        )}

                        {/* Delivery Date */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <label className="block text-sm font-semibold text-gray-900 mb-3 font-nunito">
                                Desired Delivery Date
                            </label>
                            <div className="relative">
                                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                <input
                                    type="date"
                                    value={deliveryDate}
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 font-roboto"
                                />
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <label className="block text-sm font-semibold text-gray-900 mb-3 font-nunito">
                                Additional Notes (Optional)
                            </label>
                            <div className="relative">
                                <FileText className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    maxLength={500}
                                    rows="4"
                                    placeholder="Any special instructions or delivery preferences..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 font-roboto resize-none"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 font-roboto">{notes.length}/500 characters</p>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 font-nunito">Order Summary</h3>

                            {/* Order Items */}
                            {orderItems.length > 0 ? (
                                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                    {orderItems.map((item, index) => (
                                        <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-900 font-roboto">{item.productName}</p>
                                                    <p className="text-xs text-gray-600 font-roboto">{item.variantName}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromOrder(index)}
                                                    className="text-red-600 hover:text-red-700 p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateOrderItemQuantity(index, item.quantity - 1)}
                                                        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:border-red-600 hover:text-red-600"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-medium font-roboto w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateOrderItemQuantity(index, item.quantity + 1)}
                                                        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:border-red-600 hover:text-red-600"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-bold text-gray-900 font-roboto">
                                                    €{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm font-roboto">No items added yet</p>
                                </div>
                            )}

                            {/* Pricing Details */}
                            {orderItems.length > 0 && (
                                <>
                                    <div className="border-t border-gray-200 pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 font-roboto">Subtotal:</span>
                                            <span className="font-semibold text-gray-900 font-roboto">€{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 font-roboto">Delivery Fee:</span>
                                            <span className="font-semibold text-gray-900 font-roboto">
                        {actualDeliveryFee === 0 ? (
                            <span className="text-green-600">FREE</span>
                        ) : (
                            `€${actualDeliveryFee.toFixed(2)}`
                        )}
                      </span>
                                        </div>
                                        <div className="flex justify-between text-lg pt-2 border-t border-gray-200">
                                            <span className="font-bold text-gray-900 font-nunito">Total:</span>
                                            <span className="font-bold text-red-600 font-nunito">€{total.toFixed(2)}</span>
                                        </div>

                                        {subtotal < freeDeliveryThreshold && (
                                            <p className="text-xs text-gray-600 font-roboto mt-2">
                                                Add €{(freeDeliveryThreshold - subtotal).toFixed(2)} more for free delivery
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleSubmitOrder}
                                        disabled={orderItems.length === 0}
                                        className="w-full mt-6 px-6 py-3 bg-red-600 text-white font-bold hover:bg-red-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        style={{ borderRadius: '25px' }}
                                    >
                                        Submit Order - €{total.toFixed(2)}
                                    </button>

                                    <p className="text-xs text-center text-gray-500 mt-4 font-roboto">
                                        Orders are processed during business hours<br />
                                        Monday - Friday: 8:00 AM - 6:00 PM
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopOrder;
