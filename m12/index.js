const express = require("express");

const app = express();

//body parser
app.use(express.urlencoded({ extended: true }));

//import library mysql
//const mysql = require("mysql2");
const mysql = require("mysql2/promise");

//buat koneksi ke database
const pool = mysql.createPool({
  host: "localhost",
  database: "kuliah_soa",
  user: "root",
  password: "",
});

//GET (err,rows,fields)

//dalam bentuk async dan await
app.use("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM buku");
    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err.message,
    });
  }
});

// app.use("/", (req, res) => {
//   //   pool.execute("SELECT * FROM buku", (err, rows) => {
//   //     if (err) {
//   //       res.json({
//   //         message: "koneksi gagal",
//   //       });
//   //     }
//   //     res.json({
//   //       message: "koneksi berhasil",
//   //       data: rows,
//   //     });
//   //   });

//   //async
//   //   console.log("1");
//   //   pool.query("SELECT * FROM buku", (err, rows) => {
//   //     if (err) {
//   //       res.status(500).json({
//   //         message: "koneksi gagal",
//   //       });
//   //     } else {
//   //       console.log("2");

//   //       res.json({
//   //         message: "Koneksi berhasil",
//   //         data: rows,
//   //       });
//   //     }
//   //   });
//   //   console.log("3");

//   //promise
//   console.log("1");
//   pool
//     .query("SELECT * FROM buku")
//     .then(([rows]) => {
//       console.log("2");
//       return res.status(200).json(rows);
//     })
//     .catch((err) => {
//       console.log(err);
//       return res.status(500).json({
//         error: err.message,
//       });
//     });
//   console.log("3");
// });

//listen
const port = 3000;
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
