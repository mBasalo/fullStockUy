import { Router } from "express";
import { Product } from "../models/Product.js";

const router = Router();

// GET /api/products
router.get("/", async (_req, res) => {
  const list = await Product.find({}).sort({ createdAt: -1 }).lean();
  res.json(list);
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json(p);
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

export default router;
