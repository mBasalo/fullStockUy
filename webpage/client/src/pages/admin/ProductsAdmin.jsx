import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../../admin/Auth";

const empty = { name:"", priceUSD:"", stock:"", image:"", description:"", sku:"", category:"" };

function AdminBar({ onLogout }){
  return (
    <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
      <Link to="/admin/products">Productos</Link>
      <Link to="/admin/orders">Órdenes</Link>
      <button onClick={onLogout} className="btn-outline" style={{ marginLeft:"auto" }}>Cerrar sesión</button>
    </div>
  );
}

export default function ProductsAdmin(){
  const { api, clearToken } = useAdmin();
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  const load = async()=> {
    try {
      setLoading(true);
      const r = await api.get("/products");
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

  const onCreate = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const body = { ...form, priceUSD: Number(form.priceUSD||0), stock: Number(form.stock||0) };
      await api.post("/products", body);
      setForm(empty);
      setMsg("✅ Producto creado");
      await load();
    } catch (e) {
      if (e?.response?.status === 401) {
        clearToken(); nav("/admin/login"); return;
      }
      setMsg("❌ Error al crear");
    }
  };

  const onUpdate = async (id, patch) => {
    setMsg("");
    try {
      await api.put(`/products/${id}`, patch);
      setMsg("✅ Producto actualizado");
      await load();
    } catch (e) {
      if (e?.response?.status === 401) {
        clearToken(); nav("/admin/login"); return;
      }
      setMsg("❌ Error al actualizar");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("¿Borrar producto?")) return;
    try {
      await api.delete(`/products/${id}`);
      setMsg("🗑️ Producto borrado");
      await load();
    } catch (e) {
      if (e?.response?.status === 401) {
        clearToken(); nav("/admin/login"); return;
      }
      setMsg("❌ Error al borrar");
    }
  };

  const onFile = async (file) => {
    if (!file) return;
    setUploadErr("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      // usamos el mismo api (con header x-admin-token) pero a /upload
      const r = await api.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      // seteamos la URL en el form.image
      setForm(v => ({ ...v, image: r.data?.url || "" }));
      setMsg("✅ Imagen subida");
    } catch (e) {
      console.error(e);
      setUploadErr("❌ Error al subir imagen (tipo permitido: JPG/PNG/WebP, máx 5MB)");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Cargando…</p>;

  return (
    <div style={{ display:"grid", gap:16, maxWidth:1000, margin:"0 auto" }}>
      <AdminBar onLogout={() => { clearToken(); nav("/admin/login"); }} />
      <h1>Admin · Productos</h1>
      {msg && <div style={{ color: msg.startsWith("❌") ? "tomato" : "green" }}>{msg}</div>}

      <section style={{ border:"1px solid #ddd", borderRadius:12, padding:12 }}>
        <h3>Crear producto</h3>
        <form onSubmit={onCreate} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <input placeholder="Nombre" value={form.name} onChange={e=>setForm(v=>({...v, name:e.target.value}))}/>
          <input placeholder="Precio USD" type="number" value={form.priceUSD} onChange={e=>setForm(v=>({...v, priceUSD:e.target.value}))}/>
          <input placeholder="Stock" type="number" value={form.stock} onChange={e=>setForm(v=>({...v, stock:e.target.value}))}/>

          {/* URL de imagen */}
          <input placeholder="Imagen (URL)" value={form.image} onChange={e=>setForm(v=>({...v, image:e.target.value}))}/>

          {/* Subir archivo desde PC */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>onFile(e.target.files?.[0])}/>
            {uploading && <span>Subiendo…</span>}
          </div>
          {uploadErr && <div style={{ gridColumn:"1 / span 2", color:"tomato" }}>{uploadErr}</div>}

          <input placeholder="SKU" value={form.sku} onChange={e=>setForm(v=>({...v, sku:e.target.value}))}/>
          <input placeholder="Categoría" value={form.category} onChange={e=>setForm(v=>({...v, category:e.target.value}))}/>
          <textarea placeholder="Descripción" style={{ gridColumn:"1 / span 2" }} value={form.description} onChange={e=>setForm(v=>({...v, description:e.target.value}))}/>

          {/* Preview */}
          {form.image && (
            <div style={{ gridColumn:"1 / span 2" }}>
              <div style={{ fontSize:12, opacity:.8, marginBottom:6 }}>Preview</div>
              <img src={form.image} alt="preview" style={{ maxWidth:260, borderRadius:8 }} />
            </div>
          )}

          <div style={{ gridColumn:"1 / span 2" }}>
            <button type="submit" disabled={uploading}>Crear</button>
          </div>
        </form>
      </section>

      <section style={{ border:"1px solid #ddd", borderRadius:12, padding:12 }}>
        <h3>Listado</h3>
        <div style={{ display:"grid", gap:12 }}>
          {items.map(p=>(
            <div key={p._id} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 2fr 2fr auto", gap:8, alignItems:"center", borderBottom:"1px solid #eee", paddingBottom:10 }}>
              <input defaultValue={p.name} onBlur={e=>onUpdate(p._id, { name:e.target.value })}/>
              <input type="number" defaultValue={p.priceUSD} onBlur={e=>onUpdate(p._id, { priceUSD:Number(e.target.value) })}/>
              <input type="number" defaultValue={p.stock} onBlur={e=>onUpdate(p._id, { stock:Number(e.target.value) })}/>
              <input defaultValue={p.image||""} onBlur={e=>onUpdate(p._id, { image:e.target.value })}/>
              <input defaultValue={p.sku||""} onBlur={e=>onUpdate(p._id, { sku:e.target.value })}/>
              <button onClick={()=>onDelete(p._id)} style={{ background:"#ff6b6b", color:"#fff" }}>Borrar</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
