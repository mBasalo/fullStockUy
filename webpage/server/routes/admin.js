import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

const router = Router();

function requireAdmin(req, res, next) {
  const token = req.header("x-admin-token") || req.query.token || (req.body && req.body.token);
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Simple “login check”
router.post("/login", (req, res) => {
  const { token } = req.body || {};
  if (token && token === process.env.ADMIN_TOKEN) return res.json({ ok: true });
  return res.status(401).json({ error: "Unauthorized" });
});

/* ===========================
   Upload de imágenes (multer)
   =========================== */
// Usamos la MISMA carpeta que sirve index.js: server/uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "..", "uploads");

// Tipos permitidos
const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const fileFilter = (_req, file, cb) => {
  if (allowed.has(file.mimetype)) cb(null, true);
  else cb(new Error("Tipo de archivo no permitido"), false);
};

// Storage con nombre único
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const base = path.basename(file.originalname || "img", ext).replace(/\s+/g, "-").toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${base}-${unique}${ext || ".jpg"}`);
  }
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// POST /api/admin/upload -> { url }
router.post("/upload", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se subió archivo" });

  // Construimos URL absoluta que apunta a /uploads (lo sirve index.js)
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.get("host");
  const url = `${protocol}://${host}/uploads/${req.file.filename}`;
  res.json({ url });
});

/* ===========================
   CRUD de Productos
   =========================== */
router.get("/products", requireAdmin, async (_req, res) => {
  const list = await Product.find({}).sort({ createdAt: -1 }).lean();
  res.json(list);
});

router.post("/products", requireAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    const created = await Product.create({
      name: body.name,
      priceUSD: Number(body.priceUSD || 0),
      stock: Number(body.stock || 0),
      image: body.image || "",
      description: body.description || "",
      sku: body.sku || "",
      category: body.category || ""
    });
    res.json(created);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Datos inválidos" });
  }
});

router.put("/products/:id", requireAdmin, async (req, res) => {
  try {
    const update = req.body || {};
    if (update.priceUSD != null) update.priceUSD = Number(update.priceUSD);
    if (update.stock != null) update.stock = Number(update.stock);

    const saved = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!saved) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Actualización inválida" });
  }
});

router.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    const del = await Product.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "No se pudo borrar" });
  }
});

/* ===========================
   Órdenes (listar / actualizar)
   =========================== */
router.get("/orders", requireAdmin, async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 100), 500);
  const list = await Order.find({}).sort({ createdAt: -1 }).limit(limit).lean();
  res.json(list);
});

// PATCH estado de orden. Body: { status, restock? }
router.patch("/orders/:orderId", requireAdmin, async (req, res) => {
  try {
    const { status, restock } = req.body || {};
    if (!status || !["pending", "processing", "paid", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Estado inválido" });
    }
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Orden no encontrada" });

    if (status === "cancelled" && restock) {
      const ops = order.items.map(i => ({
        updateOne: {
          filter: { _id: i.product },
          update: { $inc: { stock: i.qty } }
        }
      }));
      await Product.bulkWrite(ops);
    }

    order.status = status;
    await order.save();
    res.json({ ok: true, order });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "No se pudo actualizar la orden" });
  }
});

export default router;
