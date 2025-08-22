// client/src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../store/cart.jsx";
import { useAdmin } from "../admin/Auth.jsx";
import logo from "../assets/logo-fullstock.png";

export default function Navbar() {
  const { items } = useCart();
  const { token, clearToken } = useAdmin();
  const navigate = useNavigate();

  const count = (items || []).reduce((acc, it) => acc + (it.qty || 0), 0);

  const logout = () => {
    clearToken();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Link to="/" className="brand" aria-label="Full Stock - Inicio">
          <img src={logo} alt="Full Stock" className="brand-logo" />
          {/* <span className="brand-text">FULL STOCK</span> */}
        </Link>

        <nav className="nav" aria-label="Navegación principal">
          <NavLink to="/" end>Productos</NavLink>
          <NavLink to="/contacto" end>Contacto</NavLink>
          <NavLink to="/cart" end>
            🛒 Carrito
            {count > 0 && <span className="cart-badge">{count}</span>}
          </NavLink>

          {/* --- Admin --- */}
          {!token ? (
            <NavLink to="/admin/login" end>Admin</NavLink>
          ) : (
            <>
              <NavLink to="/admin/products" end>Productos ADM</NavLink>
              <NavLink to="/admin/orders" end>Órdenes ADM</NavLink>
              <button type="button" className="btn-outline" onClick={logout}>Salir</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
