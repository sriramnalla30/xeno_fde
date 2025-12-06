import React, { useEffect, useState } from 'react';
import { getTopCustomers, ingestData } from '../services/api';
import { Users, RefreshCw, Mail, ShoppingBag, DollarSign } from 'lucide-react';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const fetchCustomers = async () => {
        try {
            const response = await getTopCustomers(50);
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleSync = async () => {
        setSyncing(true);
        try {
            await ingestData();
            await fetchCustomers();
        } catch (error) {
            console.error('Sync error:', error);
        } finally {
            setSyncing(false);
        }
    };

    const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

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
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-500 mt-1">View all customers from your Shopify store</p>
                </div>
                <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Syncing...' : 'Sync Customers'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.length === 0 ? (
                    <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium text-gray-500">No customers yet</p>
                        <p className="text-sm mt-1 text-gray-400">Click "Sync Customers" to fetch from Shopify</p>
                    </div>
                ) : (
                    customers.map((customer, index) => (
                        <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                >
                                    {customer.first_name?.[0]}{customer.last_name?.[0]}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">
                                        {customer.first_name} {customer.last_name}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <Mail className="w-4 h-4 mr-1" />
                                        {customer.email}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <ShoppingBag className="w-4 h-4 mr-1" />
                                        Orders
                                    </div>
                                    <p className="font-semibold text-gray-900 mt-1">{customer.orders_count || 0}</p>
                                </div>
                                <div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <DollarSign className="w-4 h-4 mr-1" />
                                        Total Spent
                                    </div>
                                    <p className="font-semibold text-gray-900 mt-1">
                                        ${parseFloat(customer.total_spent || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {customers.length > 0 && (
                <div className="text-center text-sm text-gray-500">
                    Showing {customers.length} customer(s)
                </div>
            )}
        </div>
    );
};

export default Customers;
