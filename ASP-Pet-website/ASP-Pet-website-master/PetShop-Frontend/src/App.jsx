import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Pets from './pages/Pets';
import Shop from './pages/Shop';
import PetDetail from './pages/PetDetail';
import ProductDetail from './pages/ProductDetail';
import Register from './pages/Register';
// VerifyEmail removed - no email verification needed
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPets from './pages/admin/AdminPets';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminVouchers from './pages/admin/AdminVouchers';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminGoods from './pages/admin/AdminGoods';
// Service Pages
import Services from './pages/Services';

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Public Routes with Navbar */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/register" element={<><Navbar /><Register /></>} />
        {/* VerifyEmail route removed */}
        <Route path="/forgot-password" element={<><Navbar /><ForgotPassword /></>} />
        <Route path="/reset-password" element={<><Navbar /><ResetPassword /></>} />
        <Route path="/pets" element={<><Navbar /><Pets /></>} />
        <Route path="/pets/:species" element={<><Navbar /><Pets /></>} />
        <Route path="/pets/detail/:id" element={<><Navbar /><PetDetail /></>} />
        <Route path="/shop" element={<><Navbar /><Shop /></>} />
        <Route path="/shop/detail/:id" element={<><Navbar /><ProductDetail /></>} />
        <Route path="/cart" element={<><Navbar /><Cart /></>} />
        <Route path="/checkout" element={<><Navbar /><Checkout /></>} />
        <Route path="/orders" element={<><Navbar /><OrderHistory /></>} />
        <Route path="/orders/:id" element={<><Navbar /><OrderDetail /></>} />
        <Route path="/profile" element={<><Navbar /><Profile /></>} />
        <Route path="/change-password" element={<><Navbar /><ChangePassword /></>} />
        <Route path="/services" element={<><Navbar /><Services /></>} />

        {/* Admin Routes - No Navbar, uses AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="pets" element={<AdminPets />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="vouchers" element={<AdminVouchers />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="goods" element={<AdminGoods />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;

