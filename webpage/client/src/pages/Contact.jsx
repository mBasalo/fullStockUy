// client/src/pages/Contact.jsx
import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState({ loading: false, ok: null, msg: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, ok: null, msg: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ loading: false, ok: true, msg: data.message });
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error(data.message || "Algo salió mal.");
      }
    } catch (err) {
      setStatus({ loading: false, ok: false, msg: err.message });
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Contacto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2"
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2"
          type="text"
          name="phone"
          placeholder="Teléfono (opcional)"
          value={form.phone}
          onChange={handleChange}
        />
        <textarea
          className="w-full border p-2"
          name="message"
          placeholder="Mensaje"
          rows="5"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={status.loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {status.loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
      {status.msg && (
        <p className={`mt-4 ${status.ok ? "text-green-600" : "text-red-600"}`}>{status.msg}</p>
      )}
    </main>
  );
}
