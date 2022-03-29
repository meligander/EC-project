const nodemailer = require("nodemailer");
const path = require("path");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
   const client = new OAuth2(
      process.env.GOOGLE_CLIENTID,
      process.env.GOOGLE_SECRET,
      "https://developers.google.com/oauthplayground"
   );

   client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
   });

   const accessToken = await new Promise((resolve, reject) => {
      client.getAccessToken((err, token) => {
         if (err) {
            reject(err.message);
            console.log("Failed to create access token: " + err.message);
         }
         resolve(token);
      });
   });

   const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      host: "smtp.gmail.com",
      secure: true,
      // auth: {
      //    user: process.env.EMAIL,
      //    pass: process.env.EMAIL_PASSWORD,
      // },
      auth: {
         type: "OAuth2",
         user: process.env.EMAIL,
         accessToken,
         clientId: process.env.GOOGLE_CLIENTID,
         clientSecret: process.env.GOOGLE_SECRET,
         refreshToken: process.env.REFRESH_TOKEN,
      },
      tls: {
         rejectUnauthorized: false,
      },
   });

   return transporter;
};

const sendEmail = async (user_email, subject, text) => {
   const emailTransporter = await createTransporter();

   const mailOptions = {
      from: `Villa de Merlo English Center <${process.env.EMAIL}>`,
      to: user_email,
      subject,
      text,
      html: `
      <div>
         <div style='font-size: 18px;'>
            ${text}
         </div>
         <div style='text-align: center; width: min-content;'>
            <img style='width: 130px; height: 130px;margin: 50px 40px 0' src="cid:uniq-logo.png" alt="logo"/>
            <h3>Villa de Merlo English Centre</h3>
            <div style='font-size: 14px;'>
               <p>Dir: Coronel Mercau 783</p>
               <p>Tel: (02656) 476-661</p>
               <a href="www.vmenglishcentre.com.ar">www.vmenglishcentre.com.ar</a>
            </div>
         </div>
      </div>`,
      attachments: [
         {
            filename: "logo.png",
            path: path.resolve(__dirname, "../templates/assets/logo.png"),
            cid: "uniq-logo.png",
         },
      ],
   };

   return new Promise((resolve, reject) => {
      emailTransporter.sendMail(mailOptions, (error, info) => {
         if (error) {
            console.error(error.message);
            reject({ message: "Something went wrong..." });
         } else {
            console.log("Email sent: " + info.response);
            resolve(true);
         }
      });
   });
};

const changeCredentials = async (email, password, user) => {
   let subject;
   const hours = new Date().getHours();

   let text =
      (hours >= 6 && hours < 12
         ? "¡Buen día!"
         : hours >= 12 && hours < 19
         ? "¡Buenas tardes!"
         : "¡Buenas noches!") + "<br/>";

   if (password) {
      if (email !== user.email) {
         subject = "Cambio de credenciales";
         text += `El email y la constraseña en nuestra página se han modificado.
      Desde ahora en más utilice este email para poder ingresar a nuestra página web.`;
      } else {
         subject = "Cambio de contraseña";
         text +=
            "Se ha modificado correctamente la constraseña para poder ingresar a nuestra página web.";
      }
   } else {
      subject = "Cambio de email";
      text += `Se ha realizado un cambio de email en nuestra página web.
          Ahora puede ingresar a esta utilizando el mail ${email}.`;
   }

   text += "<br/><br/>Muchas gracias por elegirnos.";

   if (user.email === "") await newUser(user.type, email);
   else await sendEmail(email, subject, text);
};

const newUser = async (type, email) => {
   let text = "";

   switch (type) {
      case "teacher":
         text = `revisar los cursos que tiene asignado, agregar notas e inasistencias como
         también ver la información tanto de sus alumnos como de todas las personas involucradas
         en la academia.`;
         break;
      case "student":
         text = `revisar sus notas, inasistencias y cuotas a pagar y ver información para contactar a
      compañeros y profesor.`;
         break;
      case "guardian":
         text = `revisar las notas, inasistencias, cuotas a pagar y ver información
         para contactar a los profesores.`;
         break;
      default:
         text = `realizar todo lo relacionado a la administración de la acamedia.`;
         break;
   }

   await sendEmail(
      email,
      "¡Bienvenido!",
      `¡Bienvenido a Villa de Merlo English Centre! <br/><br/>Ahora podrá ingresar a nuestra página web
   utilizando este mail y la contraseña '12345678'. Le recomendamos que cambie la contraseña
    para que sea más seguro. <br/>En la página podrá ${text} <br/><br/>Muchas gracias por elegirnos.`
   );
};

module.exports = { newUser, changeCredentials, sendEmail };
