import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../store/cart.jsx";
import { toast } from "react-toastify";   // 👈 importamos Toastify

const formatUSD = (n) => `USD ${Number(n || 0).toFixed(2)}`;

export default function Product() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { add } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setP(res.data);
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="help">Cargando…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!p) return <p className="error">Producto no encontrado.</p>;

  return (
    <div className="product-view">
      <div className="product-hero card">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="product-hero__img"
            loading="eager"
          />
        ) : (
          <div className="product-thumb__placeholder">Sin imagen</div>
        )}
      </div>

      <div className="product-info card">
        <Link to="/" className="help">← Volver</Link>
        <h1 className="product-title-lg">{p.name}</h1>

        <div className="stack-sm">
          <div className="price" style={{ fontSize: 22 }}>{formatUSD(p.priceUSD)}</div>
          {typeof p.stock !== "undefined" && (
            <div className="help">Stock: {p.stock}</div>
          )}
        </div>

        {p.description && (
          <p className="mt-md" style={{ whiteSpace: "pre-wrap" }}>{p.description}</p>
        )}

        <div className="mt-lg">
          <button
            className="btn product-add"
     onClick={(e) => {
  add(p, 1);
  e.currentTarget.classList.add("added");
  setTimeout(() => e.currentTarget.classList.remove("added"), 100);
toast("✅ Producto agregado al carrito", {
  style: { background: "#18cd18ff", color: "#fff", fontWeight: "600" },
});
            }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
