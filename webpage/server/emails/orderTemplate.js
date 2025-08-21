// server/emails/orderTemplate.js
export function orderHtml(order) {
  const items = (order.items || [])
    .map(it => `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid #eee">${it.name}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">x${it.qty}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">$${Number(it.priceUSD||0).toFixed(2)}</td>
      </tr>`).join("");

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
    <h2>Comprobante de orden</h2>
    <p><strong>N.º de orden:</strong> ${order.orderId}</p>
    <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleString("es-UY")}</p>
    <p><strong>Estado:</strong> ${order.status || "pending"}</p>
    <p><strong>Cliente:</strong> ${order.customer?.name || "-"}${order.customer?.phone ? ` — ${order.customer.phone}`:""}</p>
    ${order.customer?.email ? `<p><strong>Email:</strong> ${order.customer.email}</p>` : ""}
    ${order.notes ? `<p><strong>Notas:</strong> ${order.notes}</p>` : ""}

    <h3>Items</h3>
    <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
      <thead>
        <tr>
          <th align="left" style="text-align:left;padding:6px 8px;border-bottom:2px solid #333">Producto</th>
          <th align="right" style="text-align:right;padding:6px 8px;border-bottom:2px solid #333">Cant.</th>
          <th align="right" style="text-align:right;padding:6px 8px;border-bottom:2px solid #333">Precio</th>
        </tr>
      </thead>
      <tbody>${items}</tbody>
    </table>
    <p style="text-align:right;margin-top:8px"><strong>Total:</strong> $${Number(order.total||0).toFixed(2)}</p>
    <p style="margin-top:24px">Gracias por tu compra.</p>
  </div>`;
}

export function orderText(order) {
  const lines = [
    `Comprobante de orden`,
    `N.º de orden: ${order.orderId}`,
    `Fecha: ${new Date(order.createdAt).toLocaleString("es-UY")}`,
    `Estado: ${order.status || "pending"}`,
    `Cliente: ${order.customer?.name || "-"}`,
    order.customer?.phone ? `Teléfono: ${order.customer.phone}` : "",
    order.customer?.email ? `Email: ${order.customer.email}` : "",
    order.notes ? `Notas: ${order.notes}` : "",
    ``,
    `Items:`,
    ...(order.items || []).map(it => `- ${it.name} x${it.qty} — $${Number(it.priceUSD||0).toFixed(2)}`),
    ``,
    `Total: $${Number(order.total||0).toFixed(2)}`,
    ``,
    `Gracias por tu compra.`
  ].filter(Boolean);
  return lines.join("\n");
}
