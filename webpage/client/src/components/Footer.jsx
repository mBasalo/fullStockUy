// client/src/components/Footer.jsx
import { Link } from "react-router-dom";
import logo from "../assets/logo-fullstock.png";
import { PAYMENT_INFO } from "../config";

export default function Footer() {
  const wa = PAYMENT_INFO?.whatsapp?.replace(/\D+/g, "") || "59800000000";
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand */}
        <div className="footer-col">
          <Link to="/" className="footer-brand">
            <img src={logo} alt="Full Stock" className="footer-logo" />
            {/* <span>FULL STOCK</span> */}
          </Link>
          <p className="footer-desc">
            Movilidad eléctrica accesible y confiable en Uruguay.
          </p>
          <div className="footer-social">
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="footer-social__link"
              title="Escribinos por WhatsApp"
            >
              {/* ícono simple */}
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.52 3.48A11.92 11.92 0 0 0 12 0C5.38 0 .03 5.35.03 11.95c0 2.1.55 4.16 1.6 5.97L0 24l6.26-1.6A11.93 11.93 0 0 0 12 23.89c6.62 0 11.97-5.35 11.97-11.95 0-3.19-1.24-6.19-3.45-8.46ZM12 21.3c-1.88 0-3.72-.5-5.32-1.45l-.38-.22-3.73.95.99-3.64-.25-.37A9.36 9.36 0 0 1 2.7 12C2.7 6.83 6.83 2.7 12 2.7s9.3 4.13 9.3 9.3-4.13 9.3-9.3 9.3Zm5.41-6.95c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.36.23-.66.08-.3-.15-1.26-.47-2.4-1.5-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.36.45-.54.15-.18.2-.3.3-.51.1-.2.05-.38-.02-.54-.07-.15-.68-1.64-.94-2.25-.25-.6-.5-.5-.68-.5h-.58c-.2 0-.53.08-.82.38-.3.3-1.08 1.06-1.08 2.58s1.11 3 1.27 3.2c.15.2 2.2 3.35 5.34 4.7.75.32 1.34.51 1.8.65.76.24 1.45.2 2 .12.6-.09 1.78-.73 2.03-1.44.25-.7.25-1.3.17-1.44-.07-.14-.27-.22-.57-.37Z" />
              </svg>
              <span>WhatsApp</span>
            </a>
            <Link to="/contacto" className="footer-social__link" title="Contacto">
              ✉️ <span>Contacto</span>
            </Link>
          </div>
        </div>

        {/* Tienda */}
        <div className="footer-col">
          <h4 className="footer-title">Tienda</h4>
          <nav className="footer-links" aria-label="Tienda">
            <Link to="/">Productos</Link>
            <Link to="/cart">Carrito</Link>
          </nav>
        </div>

        {/* Ayuda */}
        <div className="footer-col">
          <h4 className="footer-title">Ayuda</h4>
          <nav className="footer-links" aria-label="Ayuda">
            <Link to="/envios">Envíos</Link>
            <Link to="/devoluciones">Devoluciones</Link>
            <Link to="/contacto">Soporte</Link>
          </nav>
        </div>

        {/* Legales */}
        <div className="footer-col">
          <h4 className="footer-title">Legales</h4>
          <nav className="footer-links" aria-label="Legales">
            <Link to="/privacidad">Privacidad</Link>
            <Link to="/terminos">Términos</Link>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom__wrap">
          <span>© {year} Full Stock. importadores oficiales. Todos los derechos reservados.</span>
          <span className="footer-bottom__right">
            <Link to="/privacidad">Privacidad</Link> · <Link to="/terminos">Términos</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
