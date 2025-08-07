import { useMemo, useState } from "react";
import axios from "axios";
import { useCart } from "../store/cart";
import { PAYMENT_INFO } from "../config";

const formatUSD = n => `USD ${Number(n || 0).toFixed(2)}`;
const onlyDigits = s => (s || "").replace(/\D+/g,"");

// Validaciones simples
function validateName(name){
  if (!name || name.trim().length < 3) return "Poné tu nombre (mínimo 3 caracteres).";
  return "";
}
function validatePhone(phone){
  const digits = onlyDigits(phone);
  // Uruguay: 9 dígitos móviles (empieza en 09) o con +598
  if (digits.startsWith("598") && digits.length === 12) return ""; // +5989xxxxxxx → 12 dígitos sin +
  if (digits.length === 9 && digits.startsWith("09")) return "";
  if (digits.length === 8) return ""; // por si te pasan fijo local
  return "Teléfono inválido. Ej: 098123456 o +598 98 123 456";
}
function normalizeForWhatsApp(phone){
  const d = onlyDigits(phone);
  if (d.startsWith("598")) return d;
  if (d.length === 9 && d.startsWith("09")) return `598${d.slice(1)}`; // 09xxxxxxx → 5989xxxxxxx
  if (d.length === 8) return `598${d}`; // fijo local → no siempre es correcto, pero sirve de fallback
  return d;
}

export default function Checkout(){
  const { items, total, clear } = useCart();
  const [customer, setCustomer] = useState({ name:"", phone:"" });
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState({ name:false, phone:false });
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  const nameErr  = validateName(customer.name);
  const phoneErr = validatePhone(customer.phone);
  const formErrs = { name: nameErr, phone: phoneErr };
  const formInvalid = !!(nameErr || phoneErr || !items.length);

  const createOrder = async () => {
    if (formInvalid) return;
    try {
      setLoading(true);
      const res = await axios.post("/api/orders", {
        customer,
        items,
        total,
        notes
      });
      setOrderId(res.data.orderId);
      clear();
    } catch (err) {
      console.error(err);
      alert("No se pudo crear la orden. Intentá nuevamente.");
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

  // Si no hay items y no hay orden creada, pedimos volver.
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
                {touched.name && formErrs.name && <div className="error">{formErrs.name}</div>}
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
                {touched.phone && formErrs.phone && <div className="error">{formErrs.phone}</div>}
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

          <section className="card" style={{ marginBottom:16 }}>
            <h3>Resumen</h3>
            <div className="space" />
            {items.map(i=>(
              <div key={i._id} className="row" style={{ justifyContent:"space-between" }}>
                <div>{i.qty} × {i.name}</div>
                <div>{formatUSD(i.priceUSD * i.qty)}</div>
              </div>
            ))}
            <div className="hr" />
            <div className="row" style={{ justifyContent:"space-between" }}>
              <span className="total">Total</span>
              <span className="total">{formatUSD(total)}</span>
            </div>
          </section>

          <button disabled={formInvalid || loading} onClick={createOrder}>
            {loading ? "Creando orden..." : "Confirmar pedido"}
          </button>
        </>
      ) : (
        <>
          <section className="card" style={{ marginBottom:16 }}>
            <h3>¡Orden creada!</h3>
            <p><strong>Nro de orden:</strong> {orderId}</p>
            <p>Gracias {customer.name}. Para confirmar tu compra, realizá la transferencia y enviá el comprobante.</p>
          </section>

          <section className="card" style={{ marginBottom:16 }}>
            <h3>Instrucciones de pago</h3>
            <ul>
              <li><strong>Alias:</strong> {PAYMENT_INFO.bankAlias}</li>
              <li><strong>CBU/CTA:</strong> {PAYMENT_INFO.bankCBU}</li>
              <li className="help">{PAYMENT_INFO.instructions}</li>
            </ul>
            {PAYMENT_INFO.showQR && (
              <div style={{ marginTop: 12 }}>
                <img src={PAYMENT_INFO.qrImagePath} alt="QR de pago" style={{ maxWidth: 260, width:"100%", borderRadius:12 }} />
                <div className="help" style={{ marginTop:4 }}>(Escaneá el QR para pagar)</div>
              </div>
            )}
          </section>

          <a className="btn-outline" href={waLink} target="_blank" rel="noreferrer">
            Enviar comprobante por WhatsApp
          </a>
        </>
      )}
    </div>
  );
}
