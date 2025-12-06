import React, { useEffect, useState } from 'react';
import { getRecentOrders, ingestData } from '../services/api';
import { Package, RefreshCw, DollarSign, Calendar, User } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const fetchOrders = async () => {
        try {
            const response = await getRecentOrders({ limit: 50 });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSync = async () => {
        setSyncing(true);
        try {
            await ingestData();
            await fetchOrders();
        } catch (error) {
            console.error('Sync error:', error);
        } finally {
            setSyncing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500 mt-1">View all orders from your Shopify store</p>
                </div>
                <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Syncing...' : 'Sync Orders'}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg font-medium">No orders yet</p>
                                        <p className="text-sm mt-1">Click "Sync Orders" to fetch from Shopify</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Package className="w-5 h-5 text-gray-400 mr-3" />
                                                <span className="font-medium text-gray-900">#{order.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {new Date(order.created_at_shopify).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-gray-600">
                                                <User className="w-4 h-4 mr-2" />
                                                {order.Customer ? `${order.Customer.first_name} ${order.Customer.last_name}` : 'Guest'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${order.financial_status === 'paid' ? 'bg-green-100 text-green-700' :
                                                    order.financial_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {order.financial_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end text-gray-900 font-semibold">
                                                <DollarSign className="w-4 h-4 mr-1" />
                                                {parseFloat(order.total_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {orders.length > 0 && (
                <div className="text-center text-sm text-gray-500">
                    Showing {orders.length} order(s)
                </div>
            )}
        </div>
    );
};

export default Orders;
