import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { CATEGORIES } from "../constants/categories";
import ProductCard from "../components/ProductCard";
import promoImg from "../assets/movilidad_beneficios.png";

export default function Home() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const category = params.get("category") || "";
  const q = params.get("q") || "";

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      setErr("");
      try {
        const query = new URLSearchParams();
        if (category) query.set("category", category);
        if (q) query.set("q", q);
        const { data } = await axios.get(`/api/products?${query.toString()}`);
        if (mounted) setItems(data);
      } catch (e) {
        if (mounted) setErr("No pudimos cargar los productos. Intentá nuevamente.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [category, q]);

  const goCategory = (key) => {
    const next = new URLSearchParams(params);
    if (key) next.set("category", key);
    else next.delete("category");
    setParams(next);
  };

  if (loading) return <div className="container"><p>Cargando productos…</p></div>;
  if (err) return <div className="container"><p style={{ color: "crimson" }}>{err}</p></div>;

  return (
    <div className="catalog-layout container">
      {/* Sidebar de categorías */}
      <aside className="catalog-sidebar">
        <h3>Categorías</h3>
        <ul>
          <li>
            <button
              className={!category ? "active" : ""}
              onClick={() => goCategory(null)}
            >
              Todos
            </button>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.key}>
              <button
                className={category === c.key ? "active" : ""}
                onClick={() => goCategory(c.key)}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Imagen extra en sidebar */}
        <div className="sidebar-banner">
          <img src={promoImg} alt="Beneficios movilidad" />
        </div>
      </aside>

      {/* Grilla de productos */}
      <main className="catalog-main">
        {(!items || items.length === 0) ? (
          <div style={{ padding: "2rem 0" }}>
            <h3>Sin resultados</h3>
            <p>
              No encontramos productos{" "}
              {category ? `para “${category}”` : ""}
              {q ? ` que coincidan con “${q}”` : ""}.
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {items.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
