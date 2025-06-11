const { Pengguna, ApiTierList } = require("../models");

//cek di database, pastikan pengguna sudah ada rolenya()
const adminPage = async (req, res) => {
  return res.send(`welcome admin, welcome ${req.pengguna.pengguna_nama}`);
};

const managerPage = async (req, res) => {
  return res.send(`welcome manager, welcome ${req.pengguna.pengguna_nama}`);
};

const visitorPage = async (req, res) => {
  return res.send(`welcome visitor, welcome ${req.pengguna.pengguna_nama}`);
};

const tesAPIKey = async (req, res) => {
  // return res.send(
  //   "anda mengakses halaman ini setelah lolos pengecekan api key"
  // );

  try {
    return res.status(200).json({
      message: "Anda mengakses halaman ini setelah lolos pengecekan API key",
      pengguna: req.pengguna.pengguna_nama,
      api_level: req.pengguna.api_level,
      api_quota: res.locals.sisa_quota,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const topup = async (req, res) => {
  try {
    const { api_level, pengguna_nama, pengguna_id } = req.pengguna;

    if (api_level === "premium") {
      return res.status(403).json({
        message:
          "Akun premium tidak memerlukan topup karena sudah memiliki akses tidak terbatas.",
        api_level,
      });
    }

    if (api_level !== "freemium") {
      return res.status(403).json({
        message:
          "Top up hanya tersedia untuk akun freemium. Silahkan upgrade akun anda.",
        api_level,
      });
    }
    const quotaTier = await ApiTierList.findByPk(api_level);
    if (!quotaTier) {
      return res.status(404).json({
        message: "Tier tidak ditemukan",
      });
    }

    const topupAmount = Number(quotaTier.api_quota);
    await req.pengguna.increment({ api_quota: topupAmount });

    const penggunaNow = await Pengguna.findByPk(pengguna_id);

    return res.status(200).json({
      message: "Topup berhasil",
      pengguna: pengguna_nama,
      topup_kuota: topupAmount,
      total_quota_sekarang: penggunaNow.api_quota,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Terjadi kesalahan waktu melakukan topup",
        error: error.message,
      });
  }
};

module.exports = {
  adminPage,
  managerPage,
  visitorPage,
  tesAPIKey,
  topup,
};
