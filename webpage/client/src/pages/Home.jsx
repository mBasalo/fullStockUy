// client/src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const formatUSD = (n) => `USD ${Number(n || 0).toFixed(2)}`;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data || []);
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="help">Cargando productos…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!products.length) return <p className="help">No hay productos disponibles.</p>;

  return (
    <>
      <h1 style={{ margin: "8px 0 16px" }}>Productos</h1>

      <div className="products-grid">
        {products.map((p) => (
          <article key={p._id} className="product-card">
            <Link
              to={`/product/${p._id}`}
              className="product-thumb"
              aria-label={p.name}
            >
              {p.image ? (
                <img src={p.image} alt={p.name} loading="lazy" />
              ) : (
                <div className="product-thumb__placeholder">Sin imagen</div>
              )}
            </Link>

            <div className="product-body">
              <Link to={`/product/${p._id}`} className="product-title">
                {p.name}
              </Link>

              <div className="product-meta">
                <span className="price">{formatUSD(p.priceUSD)}</span>
                {typeof p.stock !== "undefined" && (
                  <span className="badge">Stock: {p.stock}</span>
                )}
              </div>

              {/* Sin botón aquí: el agregado al carrito se hace en el detalle */}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
