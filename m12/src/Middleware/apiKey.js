const { Op } = require("sequelize");
const { Pengguna, ApiTierList, ApiLog } = require("../models");

const checkAPIKey = async (req, res, next) => {
  try {
    const apikey = req.headers.apikey;
    if (!apikey) {
      return res
        .status(401)
        .json({ message: "API Key tidak ditemukan di header" });
    }

    const pengguna = await Pengguna.findOne({
      where: { api_key: apikey },
    });

    if (!pengguna) {
      return res.status(400).json({ message: "API Key tidak valid" });
    }
    req.pengguna = pengguna;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

//batasi jumlah request dalam jangka waktu tertentu, kecuali pengguna premium
const rateLimit = async (req, res, next) => {
  try {
    const tier = await ApiTierList.findByPk(req.pengguna.api_level);

    const count = await ApiLog.count({
      where: {
        pengguna_id: req.pengguna.pengguna_id,
        createdAt: { [Op.gte]: Date.now() - 10 * 1000 },
      },
    });
    console.log(tier.api_limit);

    if (req.pengguna.api_level !== "premium" && count >= tier.api_limit) {
      return res.sendStatus(429);
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const logAccess = async (req, res, next) => {
  try {
    await ApiLog.create({
      pengguna_id: req.pengguna.pengguna_id,
    });
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

//memeriksa apakah pengguna non premium masih punya kuota API yang tersisa
const cekQuota = async (req, res, next) => {
  try {
    const level = req.pengguna.api_level;
    const quota = req.pengguna.api_quota;

    //overage dan premium diijinkan meskipun kuotanya <=0
    if (level === "overage" || level === "premium") {
      res.locals.sisa_quota = quota;
      res.locals.api_level = level;
      return next();
    }

    //untuk yang free dan freemium: ditolak kalau kuota habis
    if (quota <= 0) {
      return res.status(400).json({
        message: "Quota sudah habis",
        sisa_quota: quota,
        api_level: level,
      });
    }

    res.locals.sisa_quota = quota;
    res.locals.api_level = level;
    // if (req.pengguna.api_level !== "premium" && req.pengguna.api_quota <= 0) {
    //   return res.status(400).json({
    //     message: "Quota sudah habis",
    //     cek_quota: req.pengguna.api_quota,
    //     api_level: req.pengguna.api_level,
    //   });
    // }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

//mengurangi kuota pemakaian API untuk pengguna non premium setelah request berhasil
const kurangiQuota = async (req, res, next) => {
  try {
    if (req.pengguna.api_level !== "premium") {
      //await req.pengguna.decrement({api_quota:1});
      await req.pengguna.increment({ api_quota: -1 });

      //untuk update data di database
      await req.pengguna.reload();

      //res.locals untuk berbagi data antara middleware dan controller,aman digunakan hanya dalam 1 permintaan, tidak mengganggu res dan req secara langsung
      res.locals.sisa_quota = req.pengguna.api_quota;
      next();
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

module.exports = {
  checkAPIKey,
  rateLimit,
  logAccess,
  cekQuota,
  kurangiQuota,
};
