import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { CATEGORIES } from '../../constants/categories';

const getAdminToken = () =>
  localStorage.getItem('admin_token') ||
  localStorage.getItem('adminToken') ||
  '';

const api = axios.create({
  baseURL: '/api/admin',
  headers: { 'x-admin-token': getAdminToken() },
});

const emptyForm = {
  name: '',
  priceUSD: '',
  stock: '',
  image: '',
  description: '',
  sku: '',
  category: 'accesorios',
};

export default function ProductsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [q, setQ] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const headers = useMemo(
    () => ({ headers: { 'x-admin-token': getAdminToken() } }),
    []
  );

  const fetchAll = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await api.get('/products', headers);
      setItems(data || []);
    } catch (e) {
      setErr('No se pudo cargar la lista de productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return (items || [])
      .filter(p => !categoryFilter || p.category === categoryFilter)
      .filter(p => !q || (p.name || '').toLowerCase().includes(q.toLowerCase()));
  }, [items, q, categoryFilter]);

  const onUploadImage = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await axios.post('/api/admin/upload', fd, {
      headers: {
        'x-admin-token': getAdminToken(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return data?.url;
  };

  const onCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        priceUSD: Number(form.priceUSD || 0),
        stock: Number(form.stock || 0),
      };
      const { data } = await api.post('/products', payload, headers);
      setItems([data, ...items]);
      setForm(emptyForm);
      alert('Producto creado.');
    } catch (e) {
      alert('Error al crear producto. Verificá los campos.');
    }
  };

  const onSaveEdit = async (id, row) => {
    try {
      const payload = {
        ...row,
        priceUSD: Number(row.priceUSD || 0),
        stock: Number(row.stock || 0),
      };
      const { data } = await api.put(`/products/${id}`, payload, headers);
      setItems(items.map(it => (it._id === id ? data : it)));
      setEditingId(null);
    } catch (e) {
      alert('No se pudo guardar.');
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('¿Eliminar producto?')) return;
    try {
      await api.delete(`/products/${id}`, headers);
      setItems(items.filter(it => it._id !== id));
    } catch {
      alert('No se pudo eliminar.');
    }
  };

  return (
    <div className="container">
      <h2>Productos</h2>

      <section className="card">
        <h3>Nuevo producto</h3>
        <form className="grid" onSubmit={onCreate}>
          <input placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input type="number" placeholder="Precio USD" value={form.priceUSD} onChange={e => setForm({ ...form, priceUSD: e.target.value })} required />
          <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <input placeholder="SKU (opcional)" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
          <input placeholder="URL de imagen" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          <label className="upload">
            Subir imagen…
            <input type="file" accept="image/*" onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) {
                const url = await onUploadImage(f);
                setForm({ ...form, image: url });
              }
            }} />
          </label>
          <textarea placeholder="Descripción" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
          <button className="btn" type="submit">Crear</button>
        </form>
      </section>

      <section className="card">
        <h3>Listado</h3>
        <div className="toolbar">
          <input placeholder="Buscar por nombre…" value={q} onChange={e => setQ(e.target.value)} />
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="">Todas las categorías</option>
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <button onClick={fetchAll}>Actualizar</button>
        </div>

        {loading ? <p>Cargando…</p> : err ? <p style={{color:'crimson'}}>{err}</p> : (
          <table className="table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio USD</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>SKU</th>
                <th style={{width: '28%'}}>Descripción</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <Row
                  key={p._id}
                  item={p}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  onSave={onSaveEdit}
                  onDelete={onDelete}
                  onUploadImage={onUploadImage}
                />
              ))}
            </tbody>
          </table>
        )}
      </section>

      <style>{`
        .container{max-width:1100px;margin:0 auto;padding:1rem}
        .card{background:#fff;border:1px solid #eee;border-radius:12px;padding:1rem;margin-bottom:1rem}
        .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem}
        .grid textarea{grid-column:1 / -1}
        .upload input[type=file]{display:none}
        .toolbar{display:flex;gap:.5rem;align-items:center;margin-bottom:.5rem}
        .table{width:100%;border-collapse:collapse}
        .table th,.table td{border-top:1px solid #eee;padding:.5rem;vertical-align:top}
        .thumb{width:64px;height:64px;object-fit:cover;border-radius:8px;background:#f5f5f5}
        .btn{background:#111;color:#fff;border:none;border-radius:8px;padding:.5rem .8rem;cursor:pointer}
      `}</style>
    </div>
  );
}

function Row({ item, editingId, setEditingId, onSave, onDelete, onUploadImage }) {
  const [row, setRow] = useState(item);

  useEffect(() => { setRow(item); }, [item]);

  const isEditing = editingId === item._id;

  return (
    <tr>
      <td>
        <img className="thumb" src={row.image || '/placeholder.png'} alt={row.name} />
        {isEditing && (
          <>
            <input
              type="text"
              placeholder="URL img"
              value={row.image || ''}
              onChange={e => setRow({ ...row, image: e.target.value })}
              style={{ width: '100%' }}
            />
            <input type="file" accept="image/*" onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) {
                const url = await onUploadImage(f);
                setRow({ ...row, image: url });
              }
            }} />
          </>
        )}
      </td>
      <td>
        {isEditing ? (
          <input value={row.name || ''} onChange={e => setRow({ ...row, name: e.target.value })} />
        ) : row.name}
      </td>
      <td>
        {isEditing ? (
          <input type="number" value={row.priceUSD ?? ''} onChange={e => setRow({ ...row, priceUSD: e.target.value })} />
        ) : (row.priceUSD ?? 0)}
      </td>
      <td>
        {isEditing ? (
          <input type="number" value={row.stock ?? ''} onChange={e => setRow({ ...row, stock: e.target.value })} />
        ) : (row.stock ?? 0)}
      </td>
      <td>
        {isEditing ? (
          <select value={row.category || 'accesorios'} onChange={e => setRow({ ...row, category: e.target.value })}>
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        ) : <span style={{textTransform:'capitalize'}}>{row.category}</span>}
      </td>
      <td>
        {isEditing ? (
          <input value={row.sku || ''} onChange={e => setRow({ ...row, sku: e.target.value })} />
        ) : (row.sku || '—')}
      </td>
      <td>
        {isEditing ? (
          <textarea rows={3} value={row.description || ''} onChange={e => setRow({ ...row, description: e.target.value })} />
        ) : (row.description || '—')}
      </td>
      <td>
        {isEditing ? (
          <>
            <button className="btn" onClick={() => onSave(item._id, row)}>Guardar</button>{' '}
            <button onClick={() => setEditingId(null)}>Cancelar</button>
          </>
        ) : (
          <>
            <button className="btn" onClick={() => setEditingId(item._id)}>Editar</button>{' '}
            <button onClick={() => onDelete(item._id)}>Eliminar</button>
          </>
        )}
      </td>
    </tr>
  );
}
