// server/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './db.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';
import contactRouter from './routes/contact.js';

dotenv.config();

const app = express();

// === Middlewares esenciales ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Conexión MongoDB ===
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGODB_URI) {
  console.error('❌ Falta MONGODB_URI en .env');
  process.exit(1);
}
connectDB(MONGODB_URI).catch(err => {
  console.error('❌ Error conectando a MongoDB:', err);
  process.exit(1);
});

// === Rutas API ===
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/contact', contactRouter);

// === Estáticos (uploads) ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Arranque ===
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
