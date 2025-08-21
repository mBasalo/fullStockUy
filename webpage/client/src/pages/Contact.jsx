import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', phone: '' });
  const [status, setStatus] = useState({ type: 'idle', text: '' });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: 'error', text: 'Completá nombre, email y mensaje.' });
      return;
    }

    setStatus({ type: 'loading', text: 'Enviando…' });

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const contentType = resp.headers.get('content-type') || '';
      let data = null;

      if (contentType.includes('application/json')) {
        data = await resp.json();
      } else {
        const text = await resp.text();
        try { data = JSON.parse(text); }
        catch { data = { success: false, error: text || 'Respuesta no JSON del servidor.' }; }
      }

      if (!resp.ok || !data?.success) {
        const msg = data?.error || `Error ${resp.status}: No se pudo enviar el mensaje.`;
        setStatus({ type: 'error', text: msg });
        return;
      }

      setStatus({ type: 'success', text: data.message || 'Mensaje enviado con éxito.' });
      setForm({ name: '', email: '', message: '', phone: '' });
    } catch {
      setStatus({ type: 'error', text: 'No se pudo conectar con el servidor. Intenta más tarde.' });
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>Contacto</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <label htmlFor="name">Nombre</label>
          <input id="name" name="name" type="text" value={form.name} onChange={onChange} required />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
        </div>

        <div>
          <label htmlFor="phone">Teléfono (opcional)</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={onChange} />
        </div>

        <div>
          <label htmlFor="message">Mensaje</label>
          <textarea id="message" name="message" rows={6} value={form.message} onChange={onChange} required />
        </div>

        <button type="submit" disabled={status.type === 'loading'}>
          {status.type === 'loading' ? 'Enviando…' : 'Enviar'}
        </button>
      </form>

      {status.type !== 'idle' && (
        <p style={{ marginTop: '1rem', color: status.type === 'error' ? 'crimson' : 'green' }}>
          {status.text}
        </p>
      )}
    </div>
  );
}
