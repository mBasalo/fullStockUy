// client/src/pages/legal/Returns.jsx
import React from "react";

export default function Returns() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Devoluciones y Garantías</h1>

      <h2 className="text-xl font-semibold mt-2 mb-2">1. Plazos</h2>
      <ul className="list-disc ml-6 space-y-1 mb-4">
        <li>Cambios o devoluciones: dentro de <strong>5 días hábiles</strong> desde la entrega.</li>
        <li>Garantía por falla de fábrica: según normativa y garantía del fabricante.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. Condiciones</h2>
      <ul className="list-disc ml-6 space-y-1 mb-4">
        <li>Producto sin uso, en su empaque original y con accesorios.</li>
        <li>Presentar comprobante de compra.</li>
        <li>No se aceptan productos dañados por uso indebido.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Excepciones</h2>
      <p className="mb-4">
        Por su naturaleza, algunos productos (por ejemplo, electrónicos usados o armados,
        baterías con signos de uso, o artículos higiénicos) pueden no ser retornables salvo
        falla de fábrica.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Procedimiento</h2>
      <ol className="list-decimal ml-6 space-y-1 mb-4">
        <li>Escribinos a <a className="text-blue-600 underline" href="mailto:contacto@fullstock.com">contacto@fullstock.com</a> indicando tu número de pedido.</li>
        <li>Te indicaremos el paso a paso y dirección de envío/devolución.</li>
        <li>Una vez recibido y verificado, realizamos cambio o reembolso.</li>
      </ol>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Costos</h2>
      <p>
        Si la devolución es por desistimiento, el costo de envío corre por cuenta del cliente.
        Si es por falla de fábrica dentro del plazo, lo cubrimos nosotros.
      </p>
    </main>
  );
}
