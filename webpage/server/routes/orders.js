import { Router } from "express";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

const router = Router();

function genOrderId() {
  const ts = new Date().toISOString().replace(/[-:.TZ]/g, "");
  return "FS-" + ts.slice(2) + "-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
}

// POST /api/orders  (crea orden, recalcula total, descuenta stock)
router.post("/", async (req, res) => {
  try {
    const { customer, items, notes } = req.body || {};
    if (!customer?.name || !customer?.phone || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: "Datos de orden inválidos" });
    }

    // Traer productos desde DB y validar cantidades/stock
    const ids = items.map(i => i._id);
    const dbProducts = await Product.find({ _id: { $in: ids } });
    if (dbProducts.length !== items.length) {
      return res.status(400).json({ error: "Un producto ya no existe" });
    }

    // Calcular total con precios actuales de DB (no confiamos en el cliente)
    let total = 0;
    const orderItems = [];

    for (const cartItem of items) {
      const dbItem = dbProducts.find(d => String(d._id) === String(cartItem._id));
      const qty = Math.max(1, Number(cartItem.qty || 1));
      if (dbItem.stock < qty) {
        return res.status(400).json({ error: `Sin stock suficiente para: ${dbItem.name}` });
      }
      total += Number(dbItem.priceUSD) * qty;
      orderItems.push({
        product: dbItem._id,
        name: dbItem.name,
        priceUSD: dbItem.priceUSD,
        qty
      });
    }

    // Descontar stock (atomizar con bulkWrite)
    const ops = items.map(cartItem => ({
      updateOne: {
        filter: { _id: cartItem._id, stock: { $gte: cartItem.qty } },
        update: { $inc: { stock: -cartItem.qty } }
      }
    }));
    const bulk = await Product.bulkWrite(ops);
    // Chequeo simple: matchedCount == modifiedCount == items.length
    if (bulk.matchedCount !== items.length || bulk.modifiedCount !== items.length) {
      return res.status(409).json({ error: "Stock cambió, reintentá la compra." });
    }

    // Crear orden
    const orderId = genOrderId();
    const order = await Order.create({
      orderId,
      customer,
      notes: notes || "",
      items: orderItems,
      total
    });

    res.json({ orderId, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo crear la orden" });
  }
});

// GET /api/orders/:orderId
router.get("/:orderId", async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId }).lean();
  if (!order) return res.status(404).json({ error: "Orden no encontrada" });
  res.json(order);
});

export default router;
