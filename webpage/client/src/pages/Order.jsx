// client/src/pages/Order.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Order() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || `Error ${res.status}`);
        if (mounted) setOrder(data);
      } catch (e) {
        if (mounted) setErr(e.message || "No se pudo cargar la orden");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div style={{maxWidth:800,margin:"0 auto",padding:"2rem 1rem"}}>Cargando orden…</div>;
  if (err) return <div style={{maxWidth:800,margin:"0 auto",padding:"2rem 1rem",color:"crimson"}}>Error: {err}</div>;
  if (!order) return null;

  const date = order.createdAt ? new Date(order.createdAt).toLocaleString("es-UY") : "";

  const badgeStyles = {
    pending: { background: "#fff3cd", color: "#664d03" },
    paid: { background: "#d1e7dd", color: "#0f5132" },
    cancelled: { background: "#f8d7da", color: "#842029" },
  };
  const badge = badgeStyles[order.status || "pending"];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Comprobante de orden</h1>

      <div style={{margin:"1rem 0",padding:"1rem",border:"1px solid #ddd",borderRadius:8}}>
        <p><strong>N.º de orden:</strong> {order.orderId || order._id}</p>
        <p><strong>Fecha:</strong> {date}</p>
        <p><strong>Estado:</strong>{" "}
          <span style={{...badge, padding:"2px 8px", borderRadius:8, fontSize:12}}>
            {order.status || "pending"}
          </span>
        </p>
        {order.customer && (
          <>
            <p><strong>Cliente:</strong> {order.customer.name || "-"}</p>
            {order.customer.phone && <p><strong>Teléfono:</strong> {order.customer.phone}</p>}
          </>
        )}
      </div>

      <h2>Items</h2>
      <div style={{ border: "1px solid #eee", borderRadius: 8 }}>
        {(order.items || []).map((it, idx) => (
          <div key={idx} style={{display:"grid", gridTemplateColumns:"1fr auto auto", gap:12, padding:"0.75rem 1rem", borderBottom:"1px solid #f2f2f2"}}>
            <div>
              <div style={{ fontWeight: 600 }}>{it.name || it.product?.name || "Producto"}</div>
              {it.variant && <div style={{ opacity: 0.7, fontSize: 14 }}>Variante: {it.variant}</div>}
            </div>
            <div style={{ textAlign: "right" }}>x{it.qty || 1}</div>
            <div style={{ textAlign: "right" }}>${Number(it.priceUSD || it.price || 0).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div style={{marginTop:16,display:"grid",gap:6,justifyContent:"end"}}>
        <div><strong>Subtotal:</strong> ${Number(order.subtotal || order.total || 0).toFixed(2)}</div>
        {"shipping" in order ? <div><strong>Envío:</strong> ${Number(order.shipping || 0).toFixed(2)}</div> : null}
        <div style={{fontSize:18}}><strong>Total:</strong> ${Number(order.total || 0).toFixed(2)}</div>
      </div>

      <div style={{marginTop:24,display:"flex",gap:12}}>
        <Link to="/" style={{padding:"0.6rem 1rem",border:"1px solid #ddd",borderRadius:8,textDecoration:"none"}}>Volver a la tienda</Link>
        <Link to="/products" style={{padding:"0.6rem 1rem",background:"#111",color:"#fff",borderRadius:8,textDecoration:"none"}}>Seguir comprando</Link>
      </div>
    </div>
  );
}
