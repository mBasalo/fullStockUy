import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/products?category=&q=
router.get('/', async (req, res) => {
  const { category, q } = req.query;
  const filter = {};
  if (category) filter.category = category;

  try {
    let query;

    if (q && q.trim()) {
      try {
        query = Product.find({
          ...filter,
          $text: { $search: q.trim() },
        })
          .select({ score: { $meta: 'textScore' } })
          .sort({ score: { $meta: 'textScore' } })
          .lean();
      } catch {
        query = Product.find({
          ...filter,
          name: { $regex: q.trim(), $options: 'i' },
        })
          .sort({ createdAt: -1 })
          .lean();
      }
    } else {
      query = Product.find(filter).sort({ createdAt: -1 }).lean();
    }

    const products = await query;
    return res.json(products);
  } catch (err) {
    console.error('GET /products error:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ✅ ESTA ES LA RUTA NUEVA PARA DETALLE
router.get('/:id', async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id).lean();
    if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
    return res.json(prod);
  } catch (err) {
    console.error('GET /products/:id error:', err);
    return res.status(500).json({ error: 'Error al obtener producto' });
  }
});

export default router;
