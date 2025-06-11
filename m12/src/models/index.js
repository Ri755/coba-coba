//Gabungkan semua model yang ada.

const db = {};
const { DataTypes } = require("sequelize");
const pool = require("../database/connection");
const Buku = require("./Buku");
const KategoriBuku = require("./KategoriBuku");
const Pengguna = require("./Pengguna");
const Toko = require("./Toko");
const TokoBuku = require("./TokoBuku");
const ApiLog = require("./ApiLog");
const ApiTierList = require("./ApiTierList");

//daftarkan bahwa ada model Buku dengan cara "NEW" model Buku
db.Buku = Buku(pool, DataTypes);
db.Toko = Toko(pool, DataTypes);
db.KategoriBuku = KategoriBuku(pool, DataTypes);
db.Pengguna = Pengguna(pool, DataTypes);
db.TokoBuku = TokoBuku(pool, DataTypes);
db.ApiLog = ApiLog(pool, DataTypes);
db.ApiTierList = ApiTierList(pool, DataTypes);

//untuk hubungkan ke associate
for (const key of Object.keys(db)) {
  db[key].associate(db);
}

module.exports = db;
