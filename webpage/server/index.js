import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';
import contactRouter from './routes/contact.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // parsea JSON antes de las rutas

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/contact', contactRouter); // ← NUEVA ruta de contacto

// Estáticos (subidas)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Levantar server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
