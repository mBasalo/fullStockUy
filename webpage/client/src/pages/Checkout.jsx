// client/src/pages/Checkout.jsx
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../store/cart";
import { PAYMENT_INFO } from "../config";

const formatUSD = n => `USD ${Number(n || 0).toFixed(2)}`;
const onlyDigits = s => (s || "").replace(/\D+/g,"");

function validateName(name){
  if (!name || name.trim().length < 3) return "Poné tu nombre (mínimo 3 caracteres).";
  return "";
}
function validatePhone(phone){
  const d = onlyDigits(phone);
  if (!d || d.length < 8) return "Ingresá un teléfono válido.";
  return "";
}
function validateEmail(email){
  if (!email) return ""; // opcional
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return ok ? "" : "Email inválido.";
}
function normalizeForWhatsApp(phone){
  const d = onlyDigits(phone);
  if (d.startsWith("598")) return d;
  if (d.length === 9 && d.startsWith("09")) return `598${d.slice(1)}`;
  if (d.length === 8) return `598${d}`;
  return d;
}

export default function Checkout(){
  const { items, total, clear } = useCart();
  const [customer, setCustomer] = useState({ name:"", phone:"", email:"" });
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState({ name:false, phone:false, email:false });
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const nameErr  = validateName(customer.name);
  const phoneErr = validatePhone(customer.phone);
  const emailErr = validateEmail(customer.email);
  const formInvalid = !!(nameErr || phoneErr || emailErr || !items.length);

  const createOrder = async () => {
    if (formInvalid) return;
    try {
      setLoading(true);
      const payload = {
        customer: { name: customer.name, phone: customer.phone, email: customer.email || "" },
        items: items.map(x => ({ _id: x._id, qty: Number(x.qty || 1) })),
        notes
      };
      const res = await axios.post("/api/orders", payload);
      setOrderId(res.data.orderId);
      clear();
      navigate(`/order/${res.data.orderId}`);
    } catch (err) {
      console.error("POST /api/orders error:", {
        status: err.response?.status,
        data: err.response?.data,
      });
      alert(err?.response?.data?.error || "No se pudo crear la orden. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const waLink = useMemo(()=>{
    const normalized = normalizeForWhatsApp(customer.phone);
    const msg = encodeURIComponent(
      `Hola, te envío el comprobante de pago.\nOrden: ${orderId || "(pendiente)"}\nNombre: ${customer.name}\nTel: ${customer.phone}`
    );
    return `https://wa.me/${normalized ? normalized : "598"+PAYMENT_INFO.whatsapp}?text=${msg}`;
  }, [orderId, customer]);

  if (!items.length && !orderId) {
    return <div className="empty">No hay productos en el carrito. Volvé atrás para agregar.</div>;
  }

  return (
    <div>
      <h1>Checkout</h1>

      {!orderId ? (
        <>
          <section className="card" style={{ marginBottom:16 }}>
            <h3>Datos del comprador</h3>
            <div className="space" />
            <div style={{ display:"grid", gap:10, maxWidth: 480 }}>
              <label>
                <div className="help">Nombre y Apellido</div>
                <input
                  className="input"
                  placeholder="Ej: Ana Pérez"
                  value={customer.name}
                  onChange={e=>setCustomer(v=>({...v, name:e.target.value}))}
                  onBlur={()=>setTouched(t=>({...t, name:true}))}
                />
                {touched.name && nameErr && <div className="error">{nameErr}</div>}
              </label>

              <label>
                <div className="help">Teléfono</div>
                <input
                  className="input"
                  placeholder="Ej: 098123456 o +598 98 123 456"
                  value={customer.phone}
                  onChange={e=>setCustomer(v=>({...v, phone:e.target.value}))}
                  onBlur={()=>setTouched(t=>({...t, phone:true}))}
                  inputMode="tel"
                />
                {touched.phone && phoneErr && <div className="error">{phoneErr}</div>}
              </label>

              <label>
                <div className="help">Email (opcional, para recibir comprobante)</div>
                <input
                  className="input"
                  placeholder="tucorreo@dominio.com"
                  value={customer.email}
                  onChange={e=>setCustomer(v=>({...v, email:e.target.value}))}
                  onBlur={()=>setTouched(t=>({...t, email:true}))}
                  inputMode="email"
                />
                {touched.email && emailErr && <div className="error">{emailErr}</div>}
              </label>

              <label>
                <div className="help">Notas (opcional)</div>
                <textarea
                  className="textarea"
                  rows={3}
                  placeholder="Indicaciones de entrega, aclaraciones, etc."
                  value={notes}
                  onChange={e=>setNotes(e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="card">
            <h3>Resumen</h3>
            <div className="space" />
            {(items || []).map(it => (
              <div key={it._id} style={{ display:"grid", gridTemplateColumns:"1fr auto auto", gap:12, padding:"8px 0" }}>
                <div>{it.name}</div>
                <div style={{ textAlign:"right" }}>x{it.qty}</div>
                <div style={{ textAlign:"right" }}>{formatUSD(it.priceUSD)}</div>
              </div>
            ))}
            <div className="space" />
            <div style={{ textAlign:"right", fontWeight:600 }}>Total: {formatUSD(total)}</div>

            {PAYMENT_INFO?.showQR && (
              <div style={{ marginTop: 16 }}>
                <img src={PAYMENT_INFO.qrImagePath} alt="QR de pago" style={{ maxWidth: 260, width:"100%", borderRadius:12 }} />
                <div className="help" style={{ marginTop:4 }}>(Escaneá el QR para pagar)</div>
              </div>
            )}
          </section>

          <div style={{ display:"flex", gap:12, marginTop:16 }}>
            <button className="btn" onClick={createOrder} disabled={loading || formInvalid}>
              {loading ? "Creando orden..." : "Confirmar pedido"}
            </button>
            <a className="btn-outline" href={waLink} target="_blank" rel="noreferrer">
              Enviar comprobante por WhatsApp
            </a>
          </div>
        </>
      ) : (
        <div className="card">
          <h3>¡Orden creada!</h3>
          <p>Número: <strong>{orderId}</strong></p>
          <Link className="btn" to={`/order/${orderId}`}>Ver comprobante</Link>
        </div>
      )}
    </div>
  );
}
