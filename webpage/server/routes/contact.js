import { Router } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_PORT === '465', // true si SSL (465), false si STARTTLS (587)
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
}

router.post('/', async (req, res) => {
  try {
    const { name, email, message, phone } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos (name, email, message) son obligatorios.'
      });
    }

    const transporter = createTransporter();

    const html = `
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
      <p><strong>Mensaje:</strong><br/>${message}</p>
    `;

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.MAIL_RECEIVER,
      subject: 'Nuevo mensaje de contacto',
      text: `Nombre: ${name}\nEmail: ${email}\n${phone ? `Teléfono: ${phone}\n` : ''}Mensaje:\n${message}`,
      html
    });

    return res.status(200).json({ success: true, message: 'Mensaje enviado con éxito.' });
  } catch (err) {
    console.error('Error en /api/contact:', err);
    return res.status(500).json({
      success: false,
      error: 'No se pudo enviar el mensaje. Intenta nuevamente más tarde.'
    });
  }
});

export default router;
