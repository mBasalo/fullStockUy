// client/src/pages/legal/Terms.jsx
import React from "react";

export default function Terms() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>
      <p className="mb-4">
        Al usar este sitio y/o realizar una compra en <strong>Fullstock</strong>,
        aceptás los siguientes términos, regidos por las leyes de la República
        Oriental del Uruguay.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Precios y disponibilidad</h2>
      <p className="mb-4">
        Los precios pueden cambiar sin previo aviso. La disponibilidad puede
        variar. Si detectamos un error de precio o stock, podremos cancelar y
        reembolsar el pedido.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. Proceso de compra</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>El pedido se confirma con la recepción del pago.</li>
        <li>Recibirás un número de pedido y comprobante.</li>
        <li>Conservá tu comprobante para gestiones de garantía o devoluciones.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Medios de pago</h2>
      <p className="mb-4">
        Aceptamos los medios de pago indicados en el checkout. Algunas opciones pueden
        implicar cargos o validaciones adicionales.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Envíos</h2>
      <p className="mb-4">
        Los plazos son estimados y pueden variar por factores logísticos. Ver
        <a className="text-blue-600 underline ml-1" href="/envios">Política de Envíos</a>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Devoluciones y garantías</h2>
      <p className="mb-4">
        Ver
        <a className="text-blue-600 underline ml-1" href="/devoluciones">
          Devoluciones y Garantías
        </a>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Limitación de responsabilidad</h2>
      <p className="mb-4">
        Dentro del marco legal aplicable, Fullstock no será responsable por daños
        indirectos o lucro cesante derivados del uso del sitio o de los productos.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Soporte</h2>
      <p className="mb-8">
        Ante consultas, escribí a{" "}
        <a className="text-blue-600 underline" href="mailto:contacto@fullstock.com">
          contacto@fullstock.com
        </a>{" "}
        o WhatsApp <a className="text-blue-600 underline" href="https://wa.me/59898671812">+598 98 671 812</a>.
      </p>
    </main>
  );
}
