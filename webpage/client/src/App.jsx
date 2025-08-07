import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

export default function App() {
  return (
    <main className="container">
      <header className="header">
        <Link to="/" className="brand">Fullstock</Link>
        <nav className="nav">
          <Link to="/">Productos</Link>
          <Link to="/cart">Carrito</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </main>
  );
}
