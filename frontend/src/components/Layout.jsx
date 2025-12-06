import React from 'react';
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children, setIsAuthenticated }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/' },
        { icon: ShoppingBag, label: 'Orders', path: '/orders' },
        { icon: Users, label: 'Customers', path: '/customers' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tenant_id');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-indigo-600">Xeno Insights</h1>
                </div>
                <nav className="flex-1 mt-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''
                                }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-6 border-t border-gray-200">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                            <p className="text-xs text-gray-500">{user.email || ''}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-gray-600 hover:text-red-600 transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Tenant: {user.tenant_id || 'demo-store'}</span>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
