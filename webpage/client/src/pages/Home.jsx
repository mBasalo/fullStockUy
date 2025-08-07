import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../store/cart";

const formatUSD = n => `USD ${Number(n || 0).toFixed(2)}`;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const { add } = useCart();

  useEffect(()=>{
    (async ()=>{
      try{
        const r = await axios.get("/api/products");
        setProducts(r.data);
      }catch(e){
        console.error(e);
        setError("No se pudieron cargar los productos.");
      }finally{
        setLoading(false);
      }
    })();
  },[]);

  if (loading) return <p className="help">Cargando productos…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <>
      <h1>Productos</h1>
      <div className="grid">
        {products.map(p=>(
          <article key={p._id} className="card">
            {p.image ? (
              <img src={p.image} alt={p.name} />
            ) : <div style={{height:150, borderRadius:10, background:"#0d1117"}}/>}
            <Link to={`/product/${p._id}`} style={{ textDecoration:"none", color:"inherit" }}>
              <h3>{p.name}</h3>
            </Link>
            <div className="row" style={{ justifyContent:"space-between" }}>
              <span className="price">{formatUSD(p.priceUSD)}</span>
              <span className="badge">{p.stock !== undefined ? `Stock: ${p.stock}` : "—"}</span>
            </div>
            <div className="space" />
            <button onClick={()=>add(p,1)}>Agregar al carrito</button>
          </article>
        ))}
      </div>
    </>
  );
}
