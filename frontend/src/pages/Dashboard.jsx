import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { getStats, getRecentOrders, getTopCustomers, getOrdersByDate, getOrdersByTime, ingestData } from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalCustomers: 0, totalOrders: 0, totalRevenue: 0, totalProducts: 0, avgOrderValue: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [ordersByDate, setOrdersByDate] = useState([]);
    const [ordersByTime, setOrdersByTime] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [dateRange, setDateRange] = useState(30);

    const fetchData = async () => {
        try {
            const [statsRes, ordersRes, customersRes, dateOrdersRes, timeOrdersRes] = await Promise.all([
                getStats(),
                getRecentOrders(),
                getTopCustomers(5),
                getOrdersByDate(dateRange),
                getOrdersByTime(dateRange),
            ]);
            setStats(statsRes.data);
            setRecentOrders(ordersRes.data);
            setTopCustomers(customersRes.data);
            setOrdersByDate(dateOrdersRes.data);
            setOrdersByTime(timeOrdersRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const handleSync = async () => {
        setSyncing(true);
        try {
            await ingestData();
            await fetchData();
        } catch (error) {
            console.error('Sync error:', error);
        } finally {
            setSyncing(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    const StatCard = ({ title, value, icon: Icon, color, trend = 12.5 }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            <div className={`mt-4 flex items-center text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                <span>{trend >= 0 ? '+' : ''}{trend}% from last month</span>
            </div>
        </div>
    );

    const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
        <div className="space-y-8">
            {/* Header with Sync Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
                    <p className="text-gray-500 mt-1">Monitor your store's performance</p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(parseInt(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value={7}>Last 7 days</option>
                        <option value={30}>Last 30 days</option>
                        <option value={90}>Last 90 days</option>
                    </select>
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Syncing...' : 'Sync Data'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`$${parseFloat(stats.totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    icon={DollarSign}
                    color="bg-green-500"
                    trend={15.3}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    color="bg-blue-500"
                    trend={8.2}
                />
                <StatCard
                    title="Total Customers"
                    value={stats.totalCustomers}
                    icon={Users}
                    color="bg-purple-500"
                    trend={12.1}
                />
                <StatCard
                    title="Avg Order Value"
                    value={`$${stats.avgOrderValue}`}
                    icon={TrendingUp}
                    color="bg-orange-500"
                    trend={-2.4}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Trend by Time */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Revenue by Time of Day</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ordersByTime}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="time" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                                    formatter={(value) => [`$${parseFloat(value).toFixed(2)}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders by Date */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Orders by Date</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ordersByDate}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                                />
                                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Customers & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Customers */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Top 5 Customers by Spend</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="pb-4">Customer</th>
                                    <th className="pb-4">Orders</th>
                                    <th className="pb-4 text-right">Total Spent</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {topCustomers.map((customer, index) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white mr-3`} style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                                                    {customer.first_name?.[0]}{customer.last_name?.[0]}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900">{customer.first_name} {customer.last_name}</span>
                                                    <p className="text-xs text-gray-500">{customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-gray-600">{customer.orders_count}</td>
                                        <td className="py-4 text-sm font-semibold text-gray-900 text-right">${parseFloat(customer.total_spent).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="pb-4">Order ID</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.slice(0, 5).map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4">
                                            <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                                            <p className="text-xs text-gray-500">{new Date(order.created_at_shopify).toLocaleDateString()}</p>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.financial_status === 'paid' ? 'bg-green-100 text-green-700' :
                                                order.financial_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {order.financial_status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm font-semibold text-gray-900 text-right">${parseFloat(order.total_price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
