import React from 'react';
import { CheckCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-3 font-nunito">Order Submitted!</h1>
                    <p className="text-gray-600 mb-2 font-roboto">Your order has been successfully placed.</p>
                    <p className="text-sm text-gray-500 mb-8 font-roboto">
                        You will receive a confirmation shortly.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-700 font-roboto">
                            <strong className="font-nunito">Order Reference:</strong> #ORD-{Date.now().toString().slice(-6)}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/shop-order')}
                        className="w-full px-6 py-3 bg-red-600 text-white font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                        style={{ borderRadius: '25px' }}
                    >
                        <Home className="w-5 h-5" />
                        Place Another Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
