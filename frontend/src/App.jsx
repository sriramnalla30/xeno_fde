import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Register setIsAuthenticated={setIsAuthenticated} />
          }
        />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Layout setIsAuthenticated={setIsAuthenticated}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/settings" element={<div className="text-center py-12 text-gray-500">Settings Page (Coming Soon)</div>} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
