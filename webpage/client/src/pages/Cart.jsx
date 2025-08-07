import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/cart";

const formatUSD = n => `USD ${Number(n || 0).toFixed(2)}`;

export default function Cart(){
  const { items, setQty, remove, total } = useCart();
  const nav = useNavigate();

  const onQty = (id, val) => {
    const n = Number(val);
    if (!Number.isFinite(n) || n < 1) return;
    setQty(id, Math.floor(n));
  };

  if(!items.length) return (
    <div className="empty">
      <h1>Carrito</h1>
      <p>Tu carrito está vacío.</p>
      <Link className="btn-outline" to="/">Volver a productos</Link>
    </div>
  );

  return (
    <div>
      <h1>Carrito</h1>
      <div className="card">
        {items.map(i=>(
          <div key={i._id} className="row" style={{ justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
            <div style={{ flex:1 }}>{i.name}</div>
            <input
              className="input"
              type="number" min={1}
              value={i.qty}
              onChange={e=>onQty(i._id, e.target.value)}
              style={{ width:90, textAlign:"center" }}
            />
            <div style={{ width:140, textAlign:"right" }}>{formatUSD(i.priceUSD * i.qty)}</div>
            <button className="btn-danger" onClick={()=>remove(i._id)}>Quitar</button>
          </div>
        ))}
        <div className="row" style={{ justifyContent:"space-between", marginTop:12 }}>
          <span className="total">Total:</span>
          <span className="total">{formatUSD(total)}</span>
        </div>
      </div>
      <div className="space" />
      <button onClick={()=>nav("/checkout")}>Ir al checkout</button>
    </div>
  );
}
