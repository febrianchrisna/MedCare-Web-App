import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MedicineList from './pages/MedicineList';
import MedicineDetail from './pages/MedicineDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMedicines from './pages/admin/MedicineManage';
import AdminOrders from './pages/admin/OrderManage';
import AdminUsers from './pages/admin/UserManage';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <div className="app-container d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/medicines" element={<MedicineList />} />
                <Route path="/medicines/:id" element={<MedicineDetail />} />
                
                {/* Protected Routes */}
                <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                <Route path="/order-success" element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
                <Route path="/orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
                <Route path="/orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/medicines" element={<AdminRoute><AdminMedicines /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
