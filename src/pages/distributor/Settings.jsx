import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Save } from 'lucide-react';

const Settings = () => {
    const [settings, setSettings] = useState({
        minQtyPerOrder: 5,
        maxQtyPerOrder: 1000,
        minOrderPrice: 100,
        deliveryPrice: 25,
        freeDeliveryThreshold: 500
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (field, value) => {
        setSettings({
            ...settings,
            [field]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header
                title="Settings"
                subtitle="Configure your distribution preferences"
            />

            <div className="p-6">
                <div className="max-w-4xl">
                    <form onSubmit={handleSubmit}>
                        {/* Order Quantity Settings */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 font-nunito mb-4">Order Quantity Settings</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="minQtyPerOrder" className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                                        Minimum Quantity per Order
                                    </label>
                                    <input
                                        type="number"
                                        id="minQtyPerOrder"
                                        value={settings.minQtyPerOrder}
                                        onChange={(e) => handleChange('minQtyPerOrder', parseInt(e.target.value))}
                                        min="1"
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1 font-roboto">Minimum units that must be ordered</p>
                                </div>

                                <div>
                                    <label htmlFor="maxQtyPerOrder" className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                                        Maximum Quantity per Order
                                    </label>
                                    <input
                                        type="number"
                                        id="maxQtyPerOrder"
                                        value={settings.maxQtyPerOrder}
                                        onChange={(e) => handleChange('maxQtyPerOrder', parseInt(e.target.value))}
                                        min="1"
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1 font-roboto">Maximum units allowed per order</p>
                                </div>
                            </div>
                        </div>

                        {/* Price Settings */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 font-nunito mb-4">Price Settings</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="minOrderPrice" className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                                        Minimum Order Price (€)
                                    </label>
                                    <input
                                        type="number"
                                        id="minOrderPrice"
                                        value={settings.minOrderPrice}
                                        onChange={(e) => handleChange('minOrderPrice', parseFloat(e.target.value))}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1 font-roboto">Orders below this amount won't be accepted</p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Settings */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 font-nunito mb-4">Delivery Settings</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="deliveryPrice" className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                                        Standard Delivery Price (€)
                                    </label>
                                    <input
                                        type="number"
                                        id="deliveryPrice"
                                        value={settings.deliveryPrice}
                                        onChange={(e) => handleChange('deliveryPrice', parseFloat(e.target.value))}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1 font-roboto">Default delivery cost</p>
                                </div>

                                <div>
                                    <label htmlFor="freeDeliveryThreshold" className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                                        Free Delivery Threshold (€)
                                    </label>
                                    <input
                                        type="number"
                                        id="freeDeliveryThreshold"
                                        value={settings.freeDeliveryThreshold}
                                        onChange={(e) => handleChange('freeDeliveryThreshold', parseFloat(e.target.value))}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-roboto bg-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1 font-roboto">Orders above this amount get free delivery</p>
                                </div>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2 font-nunito">Settings Summary</h4>
                            <ul className="text-xs text-gray-700 space-y-1 font-roboto">
                                <li>• Order range: {settings.minQtyPerOrder} - {settings.maxQtyPerOrder} units</li>
                                <li>• Minimum order value: €{settings.minOrderPrice}</li>
                                <li>• Delivery fee: €{settings.deliveryPrice}</li>
                                <li>• Free delivery from: €{settings.freeDeliveryThreshold}</li>
                            </ul>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-6 py-2 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all flex items-center"
                                style={{ borderRadius: '25px' }}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
