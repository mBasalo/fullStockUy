// server/routes/orders.js
import { Router } from "express";
import Product from "../models/Product.js"; // ✅
import { Order } from "../models/Order.js";
import { sendMail, getAdminEmail } from "../utils/mailer.js";
import { orderHtml, orderText } from "../emails/orderTemplate.js";

const router = Router();

function genOrderId() {
  const ts = new Date().toISOString().replace(/[-:.TZ]/g, "");
  return "FS-" + ts.slice(2) + "-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
}

router.post("/", async (req, res) => {
  try {
    const { customer, items, notes } = req.body || {};
    if (!customer?.name || !customer?.phone || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: "Datos de orden inválidos" });
    }

    const ids = items.map(i => i._id);
    const dbProducts = await Product.find({ _id: { $in: ids } });
    if (dbProducts.length !== items.length) {
      return res.status(400).json({ error: "Un producto ya no existe" });
    }

    let total = 0;
    const orderItems = [];
    for (const cartItem of items) {
      const dbItem = dbProducts.find(d => String(d._id) === String(cartItem._id));
      const qty = Math.max(1, Number(cartItem.qty || 1));
      if (Number(dbItem.stock) < qty) {
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

    // Descuento de stock
    const ops = items.map(({ _id, qty }) => ({
      updateOne: { filter: { _id, stock: { $gte: qty } }, update: { $inc: { stock: -qty } } }
    }));
    const bulk = await Product.bulkWrite(ops);
    if (bulk.matchedCount !== items.length || bulk.modifiedCount !== items.length) {
      return res.status(409).json({ error: "Stock cambió, reintentá la compra." });
    }

    const orderId = genOrderId();
    const order = await Order.create({
      orderId,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email || ""
      },
      notes: notes || "",
      items: orderItems,
      total
    });

    // Emails (no bloquean la respuesta)
    (async () => {
      try {
        const subject = `Tu orden ${order.orderId} — Fullstock`;
        const html = orderHtml(order);
        const text = orderText(order);

        if (order.customer?.email) {
          await sendMail({ to: order.customer.email, subject, html, text });
        }
        const adminTo = getAdminEmail();
        if (adminTo) {
          await sendMail({ to: adminTo, subject: `Nueva orden ${order.orderId}`, html, text });
        }
      } catch (e) {
        console.error("✉️ Error enviando mail de orden:", e);
      }
    })();

    res.json({ orderId, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo crear la orden" });
  }
});

router.get("/:orderId", async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId }).lean();
  if (!order) return res.status(404).json({ error: "Orden no encontrada" });
  res.json(order);
});

export default router;
