import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const fmtUSD = new Intl.NumberFormat('es-UY', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function Home() {
  const [params] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const category = params.get('category') || '';
  const q = params.get('q') || '';

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      setErr('');
      try {
        const query = new URLSearchParams();
        if (category) query.set('category', category);
        if (q) query.set('q', q);
        const { data } = await axios.get(`/api/products?${query.toString()}`);
        if (mounted) setItems(data);
      } catch (e) {
        if (mounted) setErr('No pudimos cargar los productos. Intentá nuevamente.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => { mounted = false; };
  }, [category, q]);

  if (loading) return <div className="container"><p>Cargando productos…</p></div>;
  if (err) return <div className="container"><p style={{color: 'crimson'}}>{err}</p></div>;

  return (
    <div className="container">
      {(!items || items.length === 0) ? (
        <div style={{ padding: '2rem 0' }}>
          <h3>Sin resultados</h3>
          <p>No encontramos productos {category ? `para “${category}”` : ''}{q ? ` que coincidan con “${q}”` : ''}.</p>
        </div>
      ) : (
        <div className="products-grid">
          {items.map(p => (
            <article key={p._id} className="product-card">
              <Link to={`/product/${p._id}`} className="product-thumb">
                <img src={p.image || '/placeholder.png'} alt={p.name} loading="lazy" />
              </Link>
              <div className="product-body">
                <h3 className="product-title">
                  <Link to={`/product/${p._id}`}>{p.name}</Link>
                </h3>
                <div className="product-meta">
                  <span className="price">{fmtUSD.format(p.priceUSD || 0)}</span>
                  {p.category && <span className="chip">{p.category}</span>}
                </div>
                <Link className="btn" to={`/product/${p._id}`}>Ver detalle</Link>
              </div>
            </article>
          ))}
        </div>
      )}
      {/* estilos mínimos (podés moverlos a tu CSS global) */}
      <style>{`
        .container{max-width:1200px;margin:0 auto;padding:1rem;}
        .products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;}
        .product-card{border:1px solid #eee;border-radius:12px;overflow:hidden;background:#fff;display:flex;flex-direction:column}
        .product-thumb img{width:100%;height:200px;object-fit:cover;display:block;background:#fafafa}
        .product-body{padding:.75rem 1rem;display:flex;flex-direction:column;gap:.5rem}
        .product-title{font-size:1rem;line-height:1.2;margin:0}
        .product-meta{display:flex;align-items:center;gap:.5rem;justify-content:space-between}
        .price{font-weight:700}
        .chip{background:#f0f0f0;border-radius:999px;padding:.15rem .6rem;font-size:.8rem;text-transform:capitalize}
        .btn{display:inline-block;background:#111;color:#fff;text-decoration:none;padding:.5rem .8rem;border-radius:8px;text-align:center}
        .btn:hover{background:#222}
      `}</style>
    </div>
  );
}
