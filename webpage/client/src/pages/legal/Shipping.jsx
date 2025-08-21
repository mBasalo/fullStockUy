// client/src/pages/legal/Shipping.jsx
import React from "react";

export default function Shipping() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Política de Envíos</h1>
      <p className="mb-4">
        Realizamos envíos a todo Uruguay mediante empresas de paquetería y/o
        logística aliadas.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Plazos estimados</h2>
      <ul className="list-disc ml-6 space-y-1 mb-4">
        <li>Montevideo y área metropolitana: 24–72 hs hábiles.</li>
        <li>Interior del país: 2–5 días hábiles.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">Costos</h2>
      <p className="mb-4">
        El costo se calcula al finalizar la compra según destino, peso/volumen y
        transportista seleccionado.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Seguimiento</h2>
      <p className="mb-4">
        Te enviaremos el número de seguimiento cuando tu pedido sea despachado.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Retiro en persona</h2>
      <p className="mb-4">
        Si habilitamos retiro, te avisaremos dirección en Maldonado/San Carlos y
        horarios disponibles.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Observaciones</h2>
      <p>
        Los plazos pueden variar por factores externos (clima, alta demanda,
        feriados). Ante cualquier inconveniente, contáctanos.
      </p>
    </main>
  );
}
