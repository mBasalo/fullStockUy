// client/src/App.jsx
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import Returns from "./pages/legal/Returns";
import Shipping from "./pages/legal/Shipping";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Order from "./pages/Order";
import Navbar from "./components/Navbar";

// Admin
import AdminLogin from "./pages/admin/Login";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import { AdminProvider } from "./admin/Auth";

export default function App() {
  return (
    <main className="container">
      {/* <header className="header">
        <Link to="/" className="brand">Fullstock</Link>
        <nav className="nav">
          <Link to="/">Productos</Link>
          <Link to="/cart">Carrito</Link>
          <Link to="/admin/products">Admin</Link>
        </nav>
      </header> */}

      <AdminProvider>

              <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<Order />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/products" element={<ProductsAdmin />} />
          <Route path="/admin/orders" element={<OrdersAdmin />} />

          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="/devoluciones" element={<Returns />} />
          <Route path="/envios" element={<Shipping />} />
          <Route path="/contacto" element={<Contact />} />
        </Routes>

        <Footer />
      </AdminProvider>
    </main>
  );
}
