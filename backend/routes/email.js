import express from 'express'
import transporter from '../nodemailer/transporter.js'
import usersModel from '../models/users.js'
import logger from '../logger/logger.js'

const route = express.Router()

route.post('/email', async (req, res) => {
  let { email } = req.body;
  if (email) email = email.trim().toLowerCase();

  try {
    const usuarioEncontrado = await usersModel.getOneByEmail(email);

    if (!usuarioEncontrado) {
      return res.status(404).json({ ok: false, msg: 'El correu no existeix' });
    }

    const pwd = usuarioEncontrado.password;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'familiabooss@gmail.com',
      to: email,
      subject: 'Recuperació de contrasenya',
      text: `Has sol·licitat la recuperació de la contrasenya.\nLa teva contrasenya es: ${pwd}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ ok: true, msg: 'Correu enviat amb èxit' });
  } catch (error) {
    logger.error(`Error enviando email de recuperación a ${email}: ${error.message || error}`);
    res.status(500).json({ ok: false, msg: 'Error al processar la sol·licitud', details: error.message });
  }
});

export default route