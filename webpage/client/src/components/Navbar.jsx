import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMotorcycle,
  faBicycle,
  faSkating,
  faTools,
  faSearch,
  faPhone,
  faShoppingCart,
  faList,
  faBars,     // hamburguesa
  faTimes     // cerrar
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { CATEGORIES } from "../constants/categories";
import logo from "../assets/logo-fullstock.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setQ(params.get("q") || "");
  }, [params]);

  const goCategory = (key) => {
    const next = new URLSearchParams(params);
    if (key) next.set("category", key);
    else next.delete("category");
    navigate({ pathname: "/", search: next.toString() });
    setMenuOpen(false); // cerrar menú en mobile
  };

  const onSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (q?.trim()) next.set("q", q.trim());
    else next.delete("q");
    navigate({ pathname: "/", search: next.toString() });
  };

  return (
    <header className="ws-header">
      {/* 🔹 Top bar */}
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

          {/* 🔹 Botón hamburguesa (visible solo en mobile) */}
          {/* <button
            className="ws-burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button> */}
        </nav>
      </div>

      {/* 🔹 Categorías (desktop siempre visibles, mobile colapsables) */}
      <div className={`ws-cats ${menuOpen ? "open" : ""}`}>
        <button onClick={() => goCategory(null)} className="ws-cat">
          <span className="ws-cat-icon">
            <FontAwesomeIcon icon={faList} />
          </span>
          <span>Todos</span>
        </button>

        {CATEGORIES.map((c) => (
          <button key={c.key} onClick={() => goCategory(c.key)} className="ws-cat">
            <span className="ws-cat-icon">
              {c.key === "motos" && <FontAwesomeIcon icon={faMotorcycle} />}
              {c.key === "bicicletas" && <FontAwesomeIcon icon={faBicycle} />}
              {c.key === "monopatines" && <FontAwesomeIcon icon={faSkating} />}
              {c.key === "accesorios" && <FontAwesomeIcon icon={faTools} />}
            </span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
