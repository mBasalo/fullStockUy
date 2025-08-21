// client/src/pages/legal/Privacy.jsx
import React from "react";

export default function Privacy() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
      <p className="mb-4">
        En <strong>Fullstock</strong> valoramos y protegemos tu privacidad. Esta
        política explica qué datos recopilamos, cómo los usamos y tus derechos,
        conforme a la legislación de la República Oriental del Uruguay.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Datos que recopilamos</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>Datos de contacto: nombre, email, teléfono, dirección.</li>
        <li>Datos de pedido y facturación: productos, importes, método de pago.</li>
        <li>Datos técnicos: cookies, IP, dispositivo, páginas visitadas.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. Finalidades</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>Procesar y entregar tus pedidos.</li>
        <li>Brindar soporte y atención al cliente.</li>
        <li>Mejorar el sitio y prevenir fraudes.</li>
        <li>Marketing opcional (solo con tu consentimiento).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Compartir información</h2>
      <p className="mb-4">
        Solo compartimos datos con proveedores necesarios para operar (por
        ejemplo, pagos y logística). No vendemos tu información.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Derechos de los usuarios</h2>
      <p className="mb-4">
        Podés solicitar acceso, rectificación o eliminación de tus datos,
        y/o revocar consentimientos, escribiendo a{" "}
        <a className="text-blue-600 underline" href="mailto:contacto@fullstock.com">
          contacto@fullstock.com
        </a>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Cookies</h2>
      <p className="mb-4">
        Utilizamos cookies propias y de terceros para funcionalidad y analítica.
        Podés configurar tu navegador para rechazarlas; algunas funciones podrían
        verse afectadas.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Seguridad</h2>
      <p className="mb-4">
        Aplicamos medidas razonables para proteger tus datos. Sin perjuicio de
        ello, ningún sistema es 100% seguro.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Cambios</h2>
      <p className="mb-8">
        Podemos actualizar esta política. Publicaremos la versión vigente en este
        sitio indicando la fecha de última actualización.
      </p>

      <p className="text-sm text-gray-500">Última actualización: {new Date().toLocaleDateString()}</p>
    </main>
  );
}
