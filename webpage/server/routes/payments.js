// server/routes/payments.js
import { Router } from "express";
import mercadopago from "mercadopago";

const router = Router();

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

router.post("/create_preference", async (req, res) => {
  try {
    const { items } = req.body;

    const preference = {
      items: items.map((item) => ({
        title: item.name,
        unit_price: Number(item.priceUSD),
        quantity: item.qty,
        currency_id: "USD",
      })),
      back_urls: {
        success: "http://localhost:5173/success",
        failure: "http://localhost:5173/failure",
        pending: "http://localhost:5173/pending",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (err) {
    console.error("❌ Error creando preferencia:", err);
    res.status(500).json({ error: "Error al crear preferencia" });
  }
});

export default router;
