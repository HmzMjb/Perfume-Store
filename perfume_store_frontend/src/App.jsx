import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminRoute from "./components/shared/AdminRoute";
import Home from "./pages/customer/Home";
import Products from "./pages/customer/Products";
import ProductDetail from "./pages/customer/ProductDetail";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Login from "./pages/customer/Login";
import Register from "./pages/customer/Register";
import Wishlist from "./pages/customer/Wishlist";
import Profile from "./pages/customer/Profile";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-main w-full">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />

          {/* Customer Routes */}
          <Route
            path="*"
            element={
              <div className="w-full">
                <Navbar />
                <main className="w-full">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
