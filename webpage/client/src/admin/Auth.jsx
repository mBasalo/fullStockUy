import { createContext, useContext, useMemo, useState } from "react";
import { makeAdminApi } from "./api";

const AdminCtx = createContext(null);
export const useAdmin = () => useContext(AdminCtx);

export function AdminProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const saveToken = (t) => { setToken(t); localStorage.setItem("admin_token", t); };
  const clearToken = () => { setToken(""); localStorage.removeItem("admin_token"); };

  const api = useMemo(() => makeAdminApi(() => token), [token]);

  return (
    <AdminCtx.Provider value={{ token, saveToken, clearToken, api }}>
      {children}
    </AdminCtx.Provider>
  );
}
