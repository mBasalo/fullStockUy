import dotenv from "dotenv";
import { connectDB } from "../db.js";
import { Product } from "../models/Product.js";
import fs from "fs";

dotenv.config();

async function main() {
  try {
    await connectDB(process.env.MONGODB_URI);
    const raw = fs.readFileSync(new URL("./products.sample.json", import.meta.url));
    const data = JSON.parse(raw.toString());

    // Limpia y carga
    await Product.deleteMany({});
    const created = await Product.insertMany(data);

    console.log(`✅ Seed OK. Productos creados: ${created.length}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

main();
