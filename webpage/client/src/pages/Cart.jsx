import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/cart";

const formatUSD = n => `USD ${Number(n || 0).toFixed(2)}`;

export default function Cart(){
  const { items, add, decrement, remove, total } = useCart();
  const nav = useNavigate();

  if(!items.length) return (
    <div className="empty">
      <h1>Carrito</h1>
      <p>Tu carrito está vacío.</p>
      <Link className="btn-outline" to="/">Volver a productos</Link>
    </div>
  );

  return (
    <div className="cart-page">
      <h1>Carrito</h1>
      <div className="cart-list">
        {items.map(i => (
          <div key={i._id} className="cart-item">
            {/* Imagen con link al producto */}
            <Link to={`/product/${i._id}`} className="cart-thumb">
              <img src={i.image || "/placeholder.png"} alt={i.name} />
            </Link>

            <div className="cart-info">
              {/* Nombre con link al producto */}
              <h3 className="cart-title">
                <Link to={`/product/${i._id}`}>{i.name}</Link>
              </h3>

              <div className="cart-meta">
                <span>Precio: {formatUSD(i.priceUSD)}</span>
                <span>Subtotal: {formatUSD(i.priceUSD * i.qty)}</span>
              </div>

              <div className="cart-actions">
                <button className="qty-btn" onClick={() => decrement(i._id)}>-</button>
                <span className="qty">{i.qty}</span>
                <button className="qty-btn" onClick={() => add(i, 1)}>+</button>
                <button className="btn-danger" onClick={()=>remove(i._id)}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}

        <div className="cart-total">
          <span>Total:</span>
          <span>{formatUSD(total)}</span>
        </div>
      </div>

      <div className="cart-checkout">
        <button className="btn" onClick={()=>nav("/checkout")}>Ir al checkout</button>
      </div>
    </div>
  );
}
