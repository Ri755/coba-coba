// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const { allow } = require("joi");

// //const upload = multer({ dest: "uploads/" });

// //Setup storage
// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     // disimpan dimana pada local storage
//     // const folderName = "uploads";

//     // Kalau ingin membuat folder thumbnail dan galeri wajib memakai let
//     let folderName = "uploads"

//     if(file.fieldname === "thumbnail") {
//       folderName = "uploads/thumbnail"
//     } else if (file.fieldname === "galeri") {
//       folderName = "uploads/galeri"
//     }

//     if (!fs.existsSync(folderName)) {
//       fs.mkdirSync(folderName, { recursive: true });
//     }


//     callback(null, folderName);
//   },
//   filename: (req, file, callback) => {
//     const fileExt = path.extname(file.originalname);
//     // const unik = Date.now() + "-" + Math.round(Math.random()*1E9);
//     const filename = Date.now() + "-" + file.originalname;
//     callback(null, filename)
//     // callback(null, file.fieldname +"-"+unik);
//   },
// });

// // Filter foto
// const fileFilter = (req,file,callback)=>{
//   const allowExt = [".jpg", ".png", ".jpeg"]
//   const fileExt = path.extname(file.originalname).toLowerCase()

//   if (allowExt.includes(fileExt)) {
//     callback(null,true)
//   } else {
//     callback(new Error("Tipe file tidak diijinkan. Hanya .jpg, .png, dan .jpeg saja yang boleh"), false)
//   }
// }


// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, //maks 5 MB
//   fileFilter: fileFilter,
// });

// router.post("/single", upload.single("gambar"), (req, res) => {
//   console.log("Single file:", req.file);
//   res.json({ message: "File berhasil di upload (single)", file: req.file });
// });

// router.post("/array", upload.array("gambar", 3), (req, res) => {
//   console.log("Multiple files:", req.files);
//   res.json({ message: "File berhasil di upload (array)", file: req.files });
// });

// //upload tanpa file (form field only)
// router.post("/formonly", upload.none(), (req, res) => {
//   console.log("Form data (no file):", req.body);
//   res.json({ message: "File berhasil dikirim tanpa file", file: req.body });
// });

// // Upload berdasarkan field-field tertentu 
// const uploadFields = upload.fields([
//   {name: "thumbnail", maxCount:1},
//   {name: "galeri", maxCount:5},
// ])

// router.post("/uploadBanyak", uploadFields, (req, res) => {
//   try {
//     const files = req.files
//     res.status(200).json({message : "File berhasil diupload", data:files})
//   } catch (error) {
//     res.status(500).json({message: "Gagal Upload", error: error.message})
//   }
// });

// module.exports = router;

// Terhubung dengan controller
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { allow } = require("joi");

const {
  singleFile,
  multiFile,
  listFile,
  renameFile,
  deleteFile,
  getprofilepicture,
} =  require("../controller/uploadFile")

router.post("/singleFile", singleFile)
router.post("/multiFile", multiFile)
router.get("/profpic", getprofilepicture)
router.get("/list", listFile)
router.get("/rename", renameFile)
router.delete("/delete", deleteFile)

module.exports = router
