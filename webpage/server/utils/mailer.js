// server/utils/mailer.js
import nodemailer from "nodemailer";

function getCfg() {
  // Permite MAIL_* o SMTP_* indistintamente
  const host = process.env.MAIL_HOST || process.env.SMTP_HOST;
  const port = Number(process.env.MAIL_PORT || process.env.SMTP_PORT || 587);
  const user = process.env.MAIL_USER || process.env.SMTP_USER;
  const pass = process.env.MAIL_PASS || process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM || user || "no-reply@example.com";
  const admin = process.env.MAIL_RECEIVER || process.env.ADMIN_EMAIL || "";

  if (!host) throw new Error("Falta MAIL_HOST (o SMTP_HOST) en .env");

  return { host, port, user, pass, from, admin, secure: port === 465 };
}

export function makeTransport() {
  const { host, port, user, pass, secure } = getCfg();
  const auth = user ? { user, pass } : undefined;
  return nodemailer.createTransport({ host, port, secure, auth });
}

export async function sendMail({ to, subject, html, text }) {
  const { from } = getCfg();
  const transporter = makeTransport();
  return transporter.sendMail({ from, to, subject, html, text });
}

export function getAdminEmail() {
  const { admin } = getCfg();
  return admin || "";
}
