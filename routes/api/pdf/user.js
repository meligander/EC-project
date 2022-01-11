const router = require("express").Router();
const { format, differenceInYears } = require("date-fns");
const path = require("path");
const pdf = require("html-pdf");

//Middleware
const auth = require("../../../middleware/auth");

//PDF Templates
const pdfTemplate = require("../../../templates/list");

const fileName = path.join(__dirname, "../../../reports/users.pdf");

//@route    GET /api/pdf/user/fetch
//@desc     Get the pdf of users
//@access   Private
router.get("/fetch", auth, (req, res) => {
   res.sendFile(fileName);
});

//@route    POST /api/pdf/user/list
//@desc     Create a pdf of users
//@access   Private
router.post("/list", auth, (req, res) => {
   const { users, usersType } = req.body;

   if (users.length === 0)
      return res.status(400).json({
         msg: "Primero debe realizar una búsqueda",
      });

   let tbody = "";
   let nameList = "";

   let thead = "<th>Nombre</th><th>Email</th><th>Celular</th>";
   switch (usersType) {
      case "student":
         thead =
            "<th>Legajo</th><th>Nombre</th><th>Edad</th><th>Celular</th><th>Categoría</th>";
         nameList = "Alumnos";
         break;
      case "guardian":
         thead += "<th>Nombre Alumno</th>";
         nameList = "Tutores";
         break;
      case "teacher":
         thead += "<th>Fecha Nacimiento</th>";
         nameList = "Profesores";
         break;
      case "admin":
         thead += "<th>Fecha Nacimiento</th><th>Rol</th>";
         nameList = "Administradores";
         break;
      default:
         break;
   }

   let name = "";
   let cel = "";
   let email = "";
   let years = "";
   let studentnumber = "";
   let category = "";
   let studentname = "";
   let dob = "";
   let type = "";

   for (let x = 0; x < users.length; x++) {
      name = "<td>" + users[x].lastname + ", " + users[x].name + "</td>";
      cel = "<td>" + (users[x].cel ? users[x].cel : "") + "</td>";

      if (usersType !== "student")
         email = "<td>" + (users[x].email ? users[x].email : "") + "</td>";
      if (usersType === "admin" || usersType === "teacher")
         dob =
            "<td>" +
            (users[x].dob
               ? format(new Date(users[x].dob.slice(0, -1)), "dd/MM/yy")
               : "") +
            "</td>";

      switch (usersType) {
         case "student":
            years =
               "<td>" +
               (users[x].dob
                  ? differenceInYears(users[x].dob.slice(0, -1), new Date())
                  : "") +
               "</td>";
            studentnumber = "<td>" + users[x].studentnumber + "</td>";
            category =
               "<td>" + (users[x].category ? users[x].category : "") + "</td>";

            tbody +=
               "<tr>" + studentnumber + name + years + cel + category + "</tr>";
            break;
         case "guardian":
            studentname =
               "<td>" +
               (users[x].children.length > 0
                  ? users[x].children[0].user.lastname +
                    ", " +
                    users[x].children[0].user.name
                  : "") +
               "</td>";
            tbody += "<tr>" + name + email + cel + studentname + "</tr>";
            break;
         case "teacher":
            tbody += "<tr>" + name + email + cel + dob + "</tr>";
            break;
         case "admin":
            const typeName =
               users[x].type === "admin"
                  ? "Administrador"
                  : users[x].type === "admin&teacher"
                  ? "Profesor y Admin"
                  : "Secretari@";
            type = "<td>" + typeName + "</td>";
            tbody += "<tr>" + name + email + cel + dob + type + "</tr>";
            break;
         default:
            break;
      }
   }

   const img = path.join(
      "file://",
      __dirname,
      "../../templates/assets/logo.png"
   );
   const css = path.join(
      "file://",
      __dirname,
      "../../templates/list/style.css"
   );

   const options = {
      format: "A4",
      header: {
         height: "15mm",
         contents: `<div></div>`,
      },
      footer: {
         height: "17mm",
         contents:
            '<footer class="footer">Villa de Merlo English Center <span class="pages">{{page}}/{{pages}}</span></footer>',
      },
   };

   try {
      pdf.create(pdfTemplate(css, img, nameList, thead, tbody), options).toFile(
         fileName,
         (err) => {
            if (err) res.send(Promise.reject());
            else res.send(Promise.resolve());
         }
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

module.exports = router;
