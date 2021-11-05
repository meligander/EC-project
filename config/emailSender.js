var nodemailer = require("nodemailer");
const path = require("path");

require("dotenv").config();

const sendEmail = (user_email, subject, text) => {
   const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
         user: process.env.EMAIL,
         pass: process.env.EMAIL_PASSWORD,
      },
   });

   const mailOptions = {
      from: `Villa de Merlo English Center <${process.env.EMAIL}>`,
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
        <a href="www.vmenglishcentre.com.ar">www.vmenglishcentre.com.ar</a>
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

   return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
            console.error(error.message);
            reject("Something went wrong...");
         } else {
            console.log("Email sent: " + info.response);
            resolve(true);
         }
      });
   });
};

module.exports = sendEmail;
