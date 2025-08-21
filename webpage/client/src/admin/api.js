import axios from "axios";

export function makeAdminApi(getToken) {
  const api = axios.create({ baseURL: "/api/admin" });
  api.interceptors.request.use(cfg => {
    const t = getToken();
    if (t) cfg.headers["x-admin-token"] = t;
    return cfg;
  });
  return api;
}
