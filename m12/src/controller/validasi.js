//const { pengguna } = require("../model");
const schema = require("../utils/validation");
const penggunaSchema = require("../utils/validation/userSchema");
const { Pengguna } = require("../models");
const bcrypt = require("bcrypt");

const validasiUser = async (req, res) => {
  try {
    const { error, value }= penggunaSchema.validate(req.body, {abortEarly:false});
    // do something else contoh masukkan data ke database, update data ke database dan sebagainya
    if (error){
      return res.status(400).json({ errors: error.details.map(err => err.message)});
    }

    const { pengguna_nama, pengguna_jk, pengguna_password } = req.body;
    // Hash password sebelum menyimpan ke database
    const hashedPassword = await bcrypt.hash(value.pengguna_password, 10);
    //console.log(hashedPassword);
    
    // Simpan data ke database
    const result = await Pengguna.create({
      pengguna_nama: value.pengguna_nama,
      pengguna_jk: value.pengguna_jk,
      pengguna_password: hashedPassword,
    });
    console.log(result);

    return res.status(200).json({ message: "Pengguna berhasil ditambahkan", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
  // try {
  //   let result = await schema.user.validateAsync(req.body, {
  //       abortEarly: false,
  //   });
  //   return res.status(200).json(result);
  // } catch (error) {
    //keluar semua errornya 
    // return res.status(400).json({ msg: "Validasi Gagal", payload: error });

    //rapikan bentuk errornya
    // const processedResult = error.details.reduce((hasil, item) => {
    //     const key = item.context.key || item.context.main;
    //     if (key in hasil) {
    //         hasil[key].push(item.message);
    //     } else {
    //         hasil[key] = [item.message];
    //     }
    //     return hasil;
    // }, {});
    // return res
    //     .status(400)
    //     .json({ msg: "Validasi Gagal", payload: processedResult });
    //}

    //contoh isi req.body:
    // {
    //   "pengguna_nama": "Grace1",
    //   "pengguna_email": "grace@stts.com",
    //   "pengguna_jk": "Wanita",
    //   "pengguna_password": "0Asx@c12",
    //   "pengguna_konfirmasi_password":"0Asx@c12",
    //   "pengguna_birthday": "2000-12-12",
    //   "pengguna_umur": 25,
    //   "app_name":"jjjjjj",
    //   "app_token":"sadasdas",
    //   "validator": ["frontend"],
    //   "isActive": true
      
    // }
};

const updatePengguna = async (req, res) => {
  try {
    //install npm i bcrypt
    const pengguna_id = req.params.id;
    const { pengguna_nama, pengguna_jk, pengguna_password } = req.body;

    // Validasi input menggunakan Joi
    const { error } = penggunaSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Cari pengguna berdasarkan ID
    const pengguna = await Pengguna.findByPk(pengguna_id);
    if (!pengguna) return res.status(404).json({ error: "Pengguna tidak ditemukan" });

    // Hash password jika ada perubahan password
    let hashedPassword = pengguna.pengguna_password;
    if (pengguna_password) {
      hashedPassword = await bcrypt.hash(pengguna_password, 10);
    }

    // Update data pengguna
    await Pengguna.update(
      {
        pengguna_nama,
        pengguna_jk,
        pengguna_password: hashedPassword,
      },
      { where: { pengguna_id } }
    );

    res.status(200).json({ message: "Data pengguna berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const validasiCustom = async (req, res) => {
  try {
    const result = await schema.customPengecekan.validateAsync(req.body, {
      abortEarly: false,
    });
    // do something else contoh masukkan data ke database, update data ke database dan sebagainya
    return res.status(200).json({ msg: "Invoice Betul" });
  } catch (error) {
   // console.log(error);
   //return res.status(400).json({ msg: "Validasi Gagal", payload: error });

    //const resultbaru = error.details.map((item) => item.message);


    //merapikan error
    // const resultbaru = error.details.reduce((hasil, item) => {
    //   const key = item.context.key || item.context.main;
    //   if (key in hasil) {
    //     hasil[key].push(item.message);
    //   } else {
    //     hasil[key] = [item.message];
    //   }
    //   return hasil;
    // }, {});
    // return res.status(400).json(resultbaru);
  }
};

module.exports = {
  validasiUser,
  updatePengguna,
  validasiCustom,
};
