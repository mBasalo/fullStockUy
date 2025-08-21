// client/src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 p-6 text-sm mt-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <h4 className="font-bold mb-2">Fullstock</h4>
          <p>Tu tienda de confianza en movilidad eléctrica.</p>
        </div>
        <div>
          <h4 className="font-bold mb-2">Legales</h4>
          <ul className="space-y-1">
            <li><Link to="/privacidad">Política de Privacidad</Link></li>
            <li><Link to="/terminos">Términos y Condiciones</Link></li>
            <li><Link to="/devoluciones">Devoluciones y Garantías</Link></li>
            <li><Link to="/envios">Política de Envíos</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Contacto</h4>
          <ul className="space-y-1">
            <li><Link to="/contacto">Formulario</Link></li>
            <li><span>📧 contacto@fullstock.com</span></li>
            <li><span>📞 +598 98 671 812</span></li>
          </ul>
        </div>
      </div>
      <p className="text-center mt-6 text-gray-400">
        © {new Date().getFullYear()} Fullstock. Todos los derechos reservados.
      </p>
    </footer>
  );
}
