import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../admin/Auth";

export default function AdminLogin() {
  const [tok, setTok] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const { saveToken } = useAdmin();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const r = await axios.post("/api/admin/login", { token: tok });
      if (r.data?.ok) {
        saveToken(tok);
        nav("/admin/products");
      }
    } catch {
      setErr("Token inválido");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Admin Login</h1>
      <form onSubmit={submit} style={{ display:"grid", gap:12 }}>
        <input
          placeholder="Token de administrador"
          value={tok}
          onChange={e=>setTok(e.target.value)}
        />
        {err && <div style={{ color: "tomato" }}>{err}</div>}
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
