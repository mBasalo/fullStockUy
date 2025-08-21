import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../store/cart.jsx';

export default function Navbar() {
  const cart = useCart();
  const count = cart ? (cart.items?.reduce((acc, it) => acc + (it.qty || 0), 0)) : 0;

  const active = ({ isActive }) =>
    ({
      padding: '0.5rem 0.75rem',
      borderRadius: 8,
      textDecoration: 'none',
      color: isActive ? '#fff' : '#111',
      background: isActive ? '#111' : 'transparent',
    });

  return (
    <header style={{ borderBottom: '1px solid #eee', background: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: 20, textDecoration: 'none', color: '#111' }}>
          Fullstock
        </Link>

        <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <NavLink to="/" style={active} end>Inicio</NavLink>
          <NavLink to="/products" style={active}>Productos</NavLink>
          <NavLink to="/contact" style={active}>Contacto</NavLink>

          {/* Admin */}
          <div style={{ display: 'flex', gap: 8 }}>
            <NavLink to="/admin/orders" style={active}>Admin Órdenes</NavLink>
            <NavLink to="/admin/products" style={active}>Admin Productos</NavLink>
            <NavLink to="/admin/login" style={active}>Login Admin</NavLink>
          </div>
        </nav>

        <div style={{ marginLeft: 'auto' }}>
          <NavLink to="/cart" style={active}>
            🛒 Carrito {count > 0 ? <span style={{
              marginLeft: 6,
              background: '#111',
              color: '#fff',
              borderRadius: 999,
              padding: '0.1rem 0.5rem',
              fontSize: 12
            }}>{count}</span> : null}
          </NavLink>
        </div>
      </div>
    </header>
  );
}
