import nodemailer from 'nodemailer';
import "dotenv/config"

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "adaw24jperez@inslaferreria.cat",
    pass: "eyph czja ayfb ouwd",
  },
});

export default transporter;