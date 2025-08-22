import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMotorcycle,
  faBicycle,
  faSkating,        // monopatines (fallback v5)
  faTools,          // accesorios (fallback v5)
  faSearch,         // buscador (fallback v5)
  faPhone,
  faShoppingCart    // carrito (fallback v5)
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { CATEGORIES } from '../constants/categories';
import logo from '../assets/logo-fullstock.png'

export default function Navbar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');

  useEffect(() => {
    setQ(params.get('q') || '');
  }, [params]);

  const goCategory = (key) => {
    const next = new URLSearchParams(params);
    if (key) next.set('category', key); else next.delete('category');
    navigate({ pathname: '/', search: next.toString() });
  };

  const onSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (q?.trim()) next.set('q', q.trim()); else next.delete('q');
    navigate({ pathname: '/', search: next.toString() });
  };

  return (
    <header className="ws-header">
      <div className="ws-top">
        <Link to="/" className="ws-logo">
          <img src={logo} alt="FullStockUY" height="50" />
        </Link>

        <form className="ws-search" onSubmit={onSearch}>
          <input
            type="search"
            placeholder="Buscar producto"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar producto"
          />
          <button aria-label="Buscar" type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>

        <nav className="ws-quick">
          <a
            className="ws-quick-item"
            href="https://www.instagram.com/fullstock.uy/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a className="ws-quick-item" href="tel:098671812" title="Llamar 098 671 812">
            <FontAwesomeIcon icon={faPhone} />
            <span className="ws-phone">098&nbsp;671&nbsp;812</span>
          </a>
          <Link className="ws-quick-item" to="/cart" aria-label="Carrito" title="Carrito">
            <FontAwesomeIcon icon={faShoppingCart} />
          </Link>
        </nav>
      </div>

      <div className="ws-cats">
        {CATEGORIES.map((c) => (
          <button key={c.key} onClick={() => goCategory(c.key)} className="ws-cat">
            <span className="ws-cat-icon">
              {c.key === 'motos'        && <FontAwesomeIcon icon={faMotorcycle} />}
              {c.key === 'bicicletas'   && <FontAwesomeIcon icon={faBicycle} />}
              {c.key === 'monopatines'  && <FontAwesomeIcon icon={faSkating} />}
              {c.key === 'accesorios'   && <FontAwesomeIcon icon={faTools} />}
            </span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* estilos mínimos (podés moverlos a tu CSS global) */}
      <style>{`
        .ws-header { background:#fff; border-bottom:1px solid #eee; }
        .ws-top { display:flex; align-items:center; gap:1rem; padding:.75rem 1rem; }
        .ws-logo img { display:block; }

        .ws-search { flex:1; display:flex; align-items:stretch; max-width:700px; margin:0 auto; }
        .ws-search input { flex:1; padding:.6rem .8rem; border:1px solid #ddd; border-right:none; border-radius:8px 0 0 8px; }
        .ws-search button { padding:0 .9rem; border:1px solid #ddd; border-left:none; background:#f7f7f7; border-radius:0 8px 8px 0; cursor:pointer; }

        .ws-quick { display:flex; align-items:center; gap:.75rem; }
        .ws-quick-item { display:flex; align-items:center; gap:.5rem; font-weight:600; color:#222; text-decoration:none; }
        .ws-phone { display:none; }
        @media (min-width: 720px){ .ws-phone { display:inline } }

        .ws-cats { background:#1e1e1e; color:#fff; display:flex; gap:1.25rem; padding:.7rem 1rem; border-radius:10px; margin:0 1rem 1rem; overflow:auto; }
        .ws-cat { background:transparent; color:#fff; border:none; display:flex; gap:.5rem; align-items:center; cursor:pointer; padding:.4rem .6rem; border-radius:8px; white-space:nowrap; }
        .ws-cat:hover { background:#2a2a2a; }
        .ws-cat-icon { width:22px; display:inline-flex; justify-content:center; }
      `}</style>
    </header>
  );
}
