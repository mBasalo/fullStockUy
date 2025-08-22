import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../../admin/Auth";

const STATUS = ["pending","processing","paid","completed","cancelled"];

function AdminBar({ onLogout }){
  return (
    <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
      <Link to="/admin/products">Productos</Link>
      <Link to="/admin/orders">Órdenes</Link>
      {/* <button onClick={onLogout} className="btn-outline" style={{ marginLeft:"auto" }}>Cerrar sesdión</button> */}
    </div>
  );
}

export default function OrdersAdmin(){
  const { api, clearToken } = useAdmin();
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const r = await api.get("/orders?limit=200");
      setItems(r.data);
    } catch (e) {
      if (e?.response?.status === 401) {
        clearToken(); nav("/admin/login"); return;
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); }, []);

  const updateStatus = async (orderId, status, restock=false) => {
    setMsg("");
    try {
      await api.patch(`/orders/${orderId}`, { status, restock });
      setMsg(`Orden ${orderId} → ${status}`);
      await load();
    } catch (e) {
      if (e?.response?.status === 401) {
        clearToken(); nav("/admin/login"); return;
      }
      setMsg("❌ Error al actualizar");
    }
  };

  if (loading) return <p>Cargando…</p>;

  return (
    <div style={{ maxWidth:1000, margin:"0 auto", display:"grid", gap:16 }}>
      <AdminBar onLogout={() => { clearToken(); nav("/admin/login"); }} />
      <h1>Admin · Órdenes</h1>
      {msg && <div style={{ color:"green" }}>{msg}</div>}
      <div style={{ display:"grid", gap:12 }}>
        {items.map(o=>(
          <div key={o._id} style={{ border:"1px solid #ddd", borderRadius:12, padding:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", gap:8, flexWrap:"wrap" }}>
              <div>
                <strong>{o.orderId}</strong> · <span>{new Date(o.createdAt).toLocaleString()}</span>
                <div>{o.customer?.name} — {o.customer?.phone}</div>
              </div>
              <div>
                <label>
                  Estado:&nbsp;
                  <select value={o.status} onChange={e=>updateStatus(o.orderId, e.target.value)}>
                    {STATUS.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                {o.status !== "cancelled" && (
                  <button onClick={()=>updateStatus(o.orderId, "cancelled", true)} style={{ marginLeft:8 }}>
                    Cancelar + Reponer stock
                  </button>
                )}
              </div>
            </div>
            <div style={{ marginTop:8 }}>
              {o.items?.map(it=>(
                <div key={it.product} style={{ display:"flex", justifyContent:"space-between" }}>
                  <div>{it.qty} × {it.name}</div>
                  <div>USD {(it.priceUSD * it.qty).toFixed(2)}</div>
                </div>
              ))}
              <div style={{ borderTop:"1px solid #eee", marginTop:8, paddingTop:8, display:"flex", justifyContent:"space-between" }}>
                <strong>Total</strong>
                <strong>USD {Number(o.total||0).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
