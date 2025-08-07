import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../store/cart";

const formatUSD = n => `USD ${Number(n || 0).toFixed(2)}`;

export default function Product() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const { add } = useCart();

  useEffect(()=>{
    (async ()=>{
      try{
        const r = await axios.get(`/api/products/${id}`);
        setP(r.data);
      }catch(e){
        console.error(e);
        setError("No se pudo cargar el producto.");
      }finally{
        setLoading(false);
      }
    })();
  },[id]);

  if (loading) return <p className="help">Cargando…</p>;
  if (error)   return <p className="error">{error}</p>;
  if (!p)      return <p className="error">Producto no encontrado.</p>;

  return (
    <div className="card" style={{ padding:16 }}>
      {p.image ? <img src={p.image} alt={p.name} style={{height:260, width:"100%", objectFit:"cover", borderRadius:10}}/> : null}
      <h1>{p.name}</h1>
      <p className="price">{formatUSD(p.priceUSD)}</p>
      <p className="help">Stock: {p.stock ?? "—"}</p>
      <button onClick={()=>add(p,1)}>Agregar al carrito</button>
    </div>
  );
}
