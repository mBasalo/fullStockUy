import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ---- Mock de productos (luego conectamos a MongoDB) ----
const products = [
  { _id: "1", name: "Monopatín KDS-DC22", priceUSD: 749, stock: 5, image: "/kds-dc22.jpg" },
  { _id: "2", name: "Bici Eléctrica Queen 26", priceUSD: 899, stock: 3, image: "/queen26.jpg" }
];

// ---- Rutas de productos ----
app.get("/api/products", (req, res) => res.json(products));
app.get("/api/products/:id", (req, res) => {
  const item = products.find(p => p._id === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

// ---- Órdenes en memoria ----
const orders = new Map(); // id -> order

function genOrderId() {
  const ts = new Date().toISOString().replace(/[-:.TZ]/g, "");
  return "FS-" + ts.slice(2) + "-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
}

// Crear orden
app.post("/api/orders", (req, res) => {
  try {
    const { customer, items, total, notes } = req.body || {};
    if (!customer?.name || !customer?.phone || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: "Datos de orden inválidos" });
    }
    const orderId = genOrderId();
    const order = {
      orderId,
      createdAt: new Date().toISOString(),
      customer,
      items,
      total,
      notes: notes || ""
    };
    orders.set(orderId, order);
    res.json({ orderId, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo crear la orden" });
  }
});

// Obtener una orden
app.get("/api/orders/:orderId", (req, res) => {
  const order = orders.get(req.params.orderId);
  if (!order) return res.status(404).json({ error: "Orden no encontrada" });
  res.json(order);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on ${PORT}`));
