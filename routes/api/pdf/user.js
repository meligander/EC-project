const router = require("express").Router();
const format = require("date-fns/format");
const path = require("path");

const generatePDF = require("../../../other/generatePDF");

//Middleware
const auth = require("../../../middleware/auth");

const fileName = path.join(__dirname, "../../../reports/users.pdf");

//@route    POST /api/pdf/user/list
//@desc     Create a pdf of users
//@access   Private
router.post("/list", auth, async (req, res) => {
   const { users, usersType } = req.body;

   if (users.length === 0)
      return res.status(400).json({
         msg: "Primero debe realizar una búsqueda",
      });

   const title = getType(usersType);
   const head = getTHead(usersType);

   const body = users.map((item) => {
      if (usersType === "student")
         return [
            item.studentnumber,
            item.lastname + ", " + item.name,
            item.dni ? item.dni : "",
            item.email ? item.email : "",
            item.cel
               ? item.cel
               : item.relatedCellphones.length > 0
               ? `${item.relatedCellphones[0].cel} - ${item.relatedCellphones[0].name} (${item.relatedCellphones[0].relation})`
               : "",
            format(new Date(item.dob.slice(0, -1)), "dd/MM/yy"),
            item.category ? item.category : "",
         ];
      else {
         const array = [
            item.lastname + ", " + item.name,
            item.email ? item.email : "",
            item.cel ? item.cel : "",
         ];

         if (usersType === "guardian")
            array.push(
               item.children.length > 0
                  ? item.children[0].lastname + ", " + item.children[0].name
                  : ""
            );
         else {
            array.push(format(new Date(item.dob.slice(0, -1)), "dd/MM"));
            if (usersType === "admin")
               array.push(
                  item.type === "admin"
                     ? "Administrador"
                     : item.type === "admin&teacher"
                     ? "Profesor y Admin"
                     : "Secretari@"
               );
         }
         return array;
      }
   });

   try {
      await generatePDF(
         fileName,
         {
            head,
            body,
            title,
         },
         { type: "list", img: "logo", margin: true, landscape: true }
      );
      res.sendFile(fileName);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@desc Function to get the header
const getTHead = (type) => {
   switch (type) {
      case "student":
         return [
            "Legajo",
            "Nombre",
            "DNI",
            "Email",
            "Celular",
            "Fecha Nacimiento",
            "Categoría",
         ];
      case "guardian":
         return ["Nombre", "Email", "Celular", "Nombre Alumno"];
      case "teacher":
         return ["Nombre", "Email", "Celular", "Fecha Nacimiento"];
      case "admin":
         return ["Nombre", "Email", "Celular", "Fecha Nacimiento", "Rol"];
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

module.exports = router;
