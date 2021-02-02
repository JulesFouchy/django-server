const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
if (process.env.DEBUG)
    require('dotenv').config();

const contactEmail = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host:'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.APP_SMTP,
      pass: process.env.APP_MAIL_PSWD,
    },
}));
  
contactEmail.verify((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Ready to Send");
    }
});

router.post('/contact', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject; 
    const message = req.body.message; 
    const mail = {
      from: process.env.APP_SMTP,
      to: process.env.APP_MAIL_TO,
      subject: subject,
      html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Message: ${message}</p>`,
    };
    contactEmail.sendMail(mail, (error) => {
      if (error) {
        res.json({ err: "ERROR" });
      } else {
        res.json({ status:"success", message: "Message Sent" });
      }
    });
});

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);
app.listen(process.env.PORT || 5000, () => console.log("Server Running"));