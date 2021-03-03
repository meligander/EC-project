var nodemailer = require("nodemailer");
const path = require("path");

require("dotenv").config();

const sendEmail = (user_email, subject, text) => {
   const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         user: process.env.EMAIL,
         pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
         rejectUnauthorized: false,
      },
   });

   const mailOptions = {
      from: process.env.EMAIL,
      to: user_email,
      subject,
      text,
      html: `<div>${text}
        <br/>
        Muchas gracias por elegirnos.
      </div>
      <div style='text-align: center; width: min-content;'>
        <img style='width: 130px; height: 130px;margin: 50px 40px 0' src="cid:uniq-logo.png" alt="logo"/>
        <h3>Villa de Merlo English Centre</h3>
        <p>Dir: Coronel Mercau 783</p>
        <p>Tel: (02656) 476-661</p>
    </div> 
      `,
      attachments: [
         {
            filename: "logo.png",
            path: path.resolve(__dirname, "../templates/assets/logo.png"),
            cid: "uniq-logo.png",
         },
      ],
   };

   transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
         console.error(error.message);
         return res.status(500).send("Error while sending email");
      } else console.log(info.response);
   });
};

module.exports = sendEmail;
