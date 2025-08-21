import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) throw new Error("Falta MONGODB_URI");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("✅ MongoDB conectado");
}
