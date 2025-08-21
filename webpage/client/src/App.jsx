import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

// Admin
import AdminLogin from "./pages/admin/Login";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import { AdminProvider } from "./admin/Auth";

export default function App() {
  return (
    <main className="container">
      <header className="header">
        <Link to="/" className="brand">Fullstock</Link>
        <nav className="nav">
          <Link to="/">Productos</Link>
          <Link to="/cart">Carrito</Link>
          <Link to="/admin/products">Admin</Link>
        </nav>
      </header>

      <AdminProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/products" element={<ProductsAdmin />} />
          <Route path="/admin/orders" element={<OrdersAdmin />} />
        </Routes>
      </AdminProvider>
    </main>
  );
}
