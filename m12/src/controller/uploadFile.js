// const express = require("express");
// const router = express.Router();
// const { allow } = require("joi");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { rename } = require("../utils/validation/userSchema");

let id = 1

const storageSingle = multer.diskStorage({
    destination:(req,file,callback)=>{
        const folderName = `uploads/${req.body.pengguna_nama}`
        if(!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName, {recursive: true})
        }
        callback(null, folderName)
    },
    filename: (req, file, callback) => {
        console.log("File : "+ file)
        const fileExt = path.extname(file.originalname).toLowerCase();
        if(file.fieldname == "pengguna_pp") {
            console.log(file)
            callback(null, `profpic ${fileExt}`)
        } else if (file.fieldname == "pengguna_file[]") {
            callback(null, `${id} ${fileExt}`)
            id++
        } else {
            callback(null,false)
        }
//     const filename = Date.now() + "-" + file.originalname;
    // callback(null, file.fieldname)
    },
})

const upload = multer({
    storage: storageSingle,
    limits: {fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        const filetype = /jpeg|jpg|png|gif/
        const fileExtension = path.extname(file.originalname).toLowerCase()

        const checkExtname = filetype.test(fileExtension)

        const checkMimeType = filetype.test(file.mimetype)
        
        if (checkMimeType && checkExtname) {
            callback(null, true)
        } else {
            callback(null,false)
            return callback(new multer.MulterError("Tipe file harus .jpeg, .jpg, .png, .gif", file.fieldname))
        }

    }
})

const singleFile=(req,res)=>{
    const uploadingFile = upload.single("pengguna_pp")
    uploadingFile(req,res,function(err) {
        if(err) {
            return res.status(400).send((err.message || err.code) + "pada field : " + err.field)
        }
        const body = req.body
        return res.status(200).json(body)
    })
}

const multiFile = (req,res) =>{}
const listFile = (req,res) =>{}
const renameFile = (req,res) =>{}
const deleteFile = (req,res) =>{}
const getprofilepicture = (req,res) =>{}

module.exports = {
    singleFile,
    multiFile,
    listFile,
    renameFile,
    deleteFile,
    getprofilepicture,
}