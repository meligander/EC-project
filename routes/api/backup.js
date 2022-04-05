const router = require("express").Router();
const path = require("path");
const differenceInWeeks = require("date-fns/differenceInWeeks");
const fs = require("fs");
const fsPromise = fs.promises;
const spawn = require("child_process").spawn;

const multer = require("multer");
let storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "uploads");
   },
   filename: function (req, file, cb) {
      cb(null, "backup.gz");
   },
});

let upload = multer({ storage: storage });

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

const filePath = path.join(__dirname, "../../backup/backupFile.gz");

//@route    GET /api/backup/fetch
//@desc     Get the backup zip
//@access   Private
router.get("/fetch", auth, async (req, res) => {
   const { local } = req.query;

   const newFilePath = !local
      ? filePath
      : filePath.replace("backupFile", "backupFileLocal");

   const fileData = await fsPromise.stat(newFilePath);

   res.writeHead(200, {
      "Content-Type": "application/x-gzip",
      "Content-Length": fileData.size,
      "Content-Disposition": 'attachment; filename="backupFile.gz"',
   });

   const readStream = fs.createReadStream(newFilePath);

   readStream.pipe(res);
});

//@route    GET /api/backup/check
//@desc     Check if last backup was made before a week ago
//@access   Private && Admin
router.get("/check", [auth, adminAuth], async (req, res) => {
   try {
      let fileData;
      if (fs.existsSync(filePath)) fileData = await fsPromise.stat(filePath);

      console.log(
         fileData,
         Math.abs(differenceInWeeks(new Date(), fileData.birthtime)) > 1,
         Math.abs(differenceInWeeks(new Date(), fileData.birthtime))
      );

      res.json(
         !fileData ||
            Math.abs(differenceInWeeks(new Date(), fileData.birthtime)) > 1
      );
   } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Backup Error" });
   }
});

//@route    POST /api/backup
//@desc     Generate a backup
//@access   Private && Admin
router.post("/", [auth, adminAuth], async (req, res) => {
   const { local } = req.body;

   const backupProcess = spawn("mongodump", [
      "--db=vmec-db",
      `--archive=${
         !local ? filePath : filePath.replace("backupFile", "backupFileLocal")
      }`,
      "--gzip",
   ]);

   backupProcess.on("exit", (code, signal) => {
      if (!code && !signal) {
         res.json({ msg: "Back Up Generado" });
      } else {
         if (code) console.log("Backup process exited with code ", code);
         else console.error("Backup process was killed with singal ", signal);
         res.status(500).json({ msg: "Backup Error" });
      }
   });
});

//@route    POST /api/backup/restore
//@desc     Restore a backup
//@access   Private && Admin
router.post(
   "/restore",
   [auth, adminAuth, upload.single("file")],
   async (req, res) => {
      const backupProcess = spawn("mongorestore", [
         "--db=vmec-db",
         "--drop",
         `--archive=${path.join(__dirname, `../../${req.file.path}`)}`,
         "--gzip",
      ]);
      backupProcess.on("exit", (code, signal) => {
         if (!code && !signal) {
            res.json({ msg: "Base de Datos Restaurada" });
         } else {
            if (code)
               console.log("Restoration process exited with code ", code);
            else
               console.error(
                  "Restoration process was killed with singal ",
                  signal
               );
            res.status(500).json({ msg: "Backup Error" });
         }
      });
   }
);

module.exports = router;
