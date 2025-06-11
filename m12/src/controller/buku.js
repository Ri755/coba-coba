//import dari database-connection.js
const db = require("../database/connection");
//import untuk Query Type
const { QueryTypes } = require("sequelize");

const getCollection = async (req, res) => {
  try {
    //const [results] = await db.query("SELECT * FROM buku");

    // const results = await db.query(
    //   "SELECT buku_nama, buku_tahun_terbit, kategori_nama FROM buku JOIN kategori_buku on kategori_buku.kategori_id=buku.kategori_id",
    //   {
    //     type: QueryTypes.SELECT,
    //   }
    // );

    // const q = req.query.q || "";
    // const [results] = await db.query(
    //   `SELECT * FROM buku WHERE buku_nama like '%${q}%'`
    // );
    // return res.status(200).json(results);

    //Replacement :namaquery
    // const q = req.query.q || "";
    // const [results] = await db.query(
    //   "SELECT * FROM buku WHERE buku_nama =:buku_nama",
    //   {
    //     replacements: { buku_nama: q },
    //     type: QueryTypes.SELECT,
    //   }
    // );

    //Replacement dengan tanda ?
    // const q = req.query.q || "";
    // const [results] = await db.query("SELECT * FROM buku WHERE buku_nama = ?", {
    //   replacements: [q],
    //   type: QueryTypes.SELECT,
    // });

    // const q = req.query.q || "";
    // const results = await db.query(
    //   `SELECT b.buku_id AS idBuku, b.buku_nama AS namaBuku, k.kategori_nama AS kategoriNama, b.buku_tahun_terbit AS bukuTahunTerbit
    //   FROM buku b
    //   JOIN kategori_buku k on k.kategori_id=b.kategori_id
    //   WHERE b.buku_nama LIKE ?`,
    //   {
    //     replacements: [`%${q}%`],
    //     type: QueryTypes.SELECT,
    //   }
    // );
    //return res.status(200).json(results);
    //bind
    const q = req.query.q || "";
    const results = await db.query(
      "SELECT * FROM buku WHERE buku_nama = $buku_nama",
      {
        bind: { buku_nama: q },
        type: QueryTypes.SELECT,
      }
    );

    //formatting tampilan dengan map
    const formatted = results.map((b) => {
      return {
        id: b.buku_id,
        name: b.buku_nama,
        publication_year: b.buku_tahun_terbit,
        kategori: {
          id: b.kategori_id,
        },
      };
    });

    if (results.length > 0) {
      return res.status(200).json(formatted);
    } else {
      return res.status(404).json({
        message: "Data tidak ditemukan",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err.message,
    });
  }
};

const tambahBuku = async (req, res) => {
  try {
    const { buku_nama, buku_tahun_terbit, kategori_id } = req.body;

    if (!buku_nama || !buku_tahun_terbit || !kategori_id) {
      return res.status(400).send({
        message: "Data tidak boleh kosong",
      });
    }

    const results = await db.query(
      "INSERT INTO buku(buku_nama, buku_tahun_terbit, kategori_id) VALUES (:buku_nama, :buku_tahun_terbit, :kategori_id)",
      {
        type: QueryTypes.INSERT,
        replacements: { buku_nama, buku_tahun_terbit, kategori_id },
      }
    );

    return res.status(200).send({
      message: `Berhasil insert buku dengan id ${results[0]}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err.message,
    });
  }
};

//PUT
//http://localhost:3000/api/v1/buku/:id
//body parser:buku_nama, buku_tahun_terbit, kategori_id
const updateBuku = async (req, res) => {};

//DELETE
//http://localhost:3000/api/v1/buku/:id
const deleteBuku = async (req, res) => {};

module.exports = {
  getCollection,
  tambahBuku,
  updateBuku,
  deleteBuku,
};
