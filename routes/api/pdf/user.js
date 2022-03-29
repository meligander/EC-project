const router = require("express").Router();
const format = require("date-fns/format");
const path = require("path");

const generatePDF = require("../../../other/generatePDF");

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

   const title = getType(usersType);
   const thead = getTHead(usersType);

   const tbody = users
      .map(
         (item) => `<tr>
      ${usersType === "student" ? `<td>${item.studentnumber}</td>` : ""}
      <td>${item.lastname + ", " + item.name}</td>
      ${usersType === "student" ? `<td>${item.dni ? item.dni : ""}</td>` : ""}
      <td>${item.email ? item.email : ""}</td>
      <td>${
         item.cel
            ? item.cel
            : item.relatedCellphones.length > 0
            ? `${item.relatedCellphones[0].cel} - ${item.relatedCellphones[0].name} (${item.relatedCellphones[0].relation})`
            : ""
      }</td>
      ${getTbody(usersType, item)}
   </tr>`
      )
      .join("");

   try {
      generatePDF(
         fileName,
         pdfTemplate,
         "list",
         {
            title,
            table: { thead, tbody },
         },
         "landscape",
         title,
         res
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@desc Function to get the header
const getTHead = (type) => {
   switch (type) {
      case "student":
         return "<th>Legajo</th><th>Nombre</th><th>DNI</th><th>Email</th><th>Celular</th><th>Fecha Nacimiento</th><th>Categoría</th>";
      case "guardian":
         return "<th>Nombre</th><th>Email</th><th>Celular</th><th>Nombre Alumno</th>";
      case "teacher":
         return "<th>Nombre</th><th>Email</th><th>Celular</th><th>Fecha Nacimiento</th>";
      case "admin":
         return "<th>Nombre</th><th>Email</th><th>Celular</th><th>Fecha Nacimiento</th><th>Rol</th>";
      default:
         return "";
   }
};

//@desc Function to get the title
const getType = (type) => {
   switch (type) {
      case "student":
         return "Alumnos";
      case "guardian":
         return "Tutores";
      case "teacher":
         return "Profesores";
      case "admin":
         return "Administradores";
      default:
         return "";
   }
};

//@desc Function to get the body
const getTbody = (type, item) => {
   switch (type) {
      case "student":
         return `<td>${format(new Date(item.dob.slice(0, -1)), "dd/MM/yy")}</td>
         <td>${item.category ? item.category : ""}</td>`;
      case "guardian":
         if (item.children.length > 0)
            return `<td>${
               item.children[0].lastname + ", " + item.children[0].name
            }</td>`;
      case "teacher":
         return `<td>${format(new Date(item.dob.slice(0, -1)), "dd/MM")}</td>`;
      case "admin":
         const typeName =
            item.type === "admin"
               ? "Administrador"
               : item.type === "admin&teacher"
               ? "Profesor y Admin"
               : "Secretari@";
         return `<td>${format(new Date(item.dob.slice(0, -1)), "dd/MM")}</td>
               <td>${typeName}</td>`;
      default:
         return "";
   }
};

module.exports = router;
