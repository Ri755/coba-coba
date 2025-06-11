const crypto = require("crypto");
const bcrypt = require("bcrypt");

const { Pengguna, Toko } = require("../models");

const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const { Sequelize } = require("sequelize");

const register = async (req, res) => {
  const body = req.body;
  const apikey = crypto.randomUUID();
  let hashedPassword = "";

  try {
    if (!body.pengguna_password) {
      return res.status(400).json({ error: "Kata sandi tidak boleh kosong" });
    }

    const saltRounds = 10;
    hashedPassword = await bcrypt.hash(body.pengguna_password, saltRounds);

    console.log(apikey);

    const result = await Pengguna.create({
      pengguna_nama: body.pengguna_nama,
      pengguna_jk: body.pengguna_jk,
      pengguna_password: hashedPassword,
      pengguna_roles: "visitor",
      api_key: apikey,
    });
    return res.status(200).json(result);
  } catch (error) {
    console.log("Error saat create pengguna", error);
    return res.status(500).json({ error: "Gagal create pengguna" });
  }
};

const login = async (req, res) => {
  const { pengguna_nama, pengguna_password } = req.body;

  if (!pengguna_nama || !pengguna_password) {
    return res.status(400).json({
      error: "Silahkan masukkan username dan password",
    });
  }

  const pengguna = await Pengguna.findOne({
    where: { pengguna_nama: pengguna_nama },
    attributes: [
      "pengguna_id",
      "pengguna_nama",
      "pengguna_jk",
      "pengguna_password",
      "roles",
    ],
    include: {
      model: Toko,
      attributes: [
        ["toko_id", "toko_id"],
        ["toko_nama", "toko_nama"],
      ],
    },
  });

  if (!pengguna) {
    return res.status(401).json({ msg: "Gagal Login" });
  }

  const checkPassowrd = await bcrypt.compare(
    pengguna_password,
    pengguna.pengguna_password
  );

  if (checkPassowrd) {
    //wajib dihapus untuk data yang sifatnya confidential
    pengguna.pengguna_password = undefined;

    const accesToken = jwt.sign({ pengguna }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30s",
    });
    const refreshToken = jwt.sign(
      { pengguna },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    //simpan refreshToken ke database
    const updatePengguna = await Pengguna.findByPk(pengguna.pengguna_id);
    await updatePengguna.update({
      refreshToken: refreshToken,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //untuk 1 day (1000 milisecond)
    });

    return res.status(200).json({
      msg: "Berhasil Login",
      token: accesToken,
      refreshToken: refreshToken,
    });
  } else {
    return res.status(401).json({ msg: "Gagal Login" });
  }
};

const refreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Invalid refresh token
      }

      const pengguna = await Pengguna.findOne({
        where: { pengguna_nama: decoded.pengguna.pengguna_nama },
        attributes: [
          "pengguna_nama",
          "pengguna_jk",
          "pengguna_password",
          "roles",
        ],
        include: {
          model: Toko,
          attributes: [
            ["toko_id", "toko_id"],
            ["toko_nama", "toko_nama"],
          ],
        },
        required: true,
      });

      if (!pengguna) {
        return res.sendStatus(403); // Pengguna tidak ditemukan (mungkin dihapus)
      }

      // ... (lanjutkan dengan membuat accessToken baru)
      pengguna.pengguna_password = undefined;
      const accessToken = jwt.sign(
        { pengguna },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      return res.status(200).json({ accessToken });
    }
  );
};

const logout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  const pengguna = await Pengguna.findOne({
    where: { refreshToken: refreshToken },
  });

  if (!pengguna) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  await pengguna.update({ refresh_token: null });
  res.clearCookie("jwt", { httpOnly: true });
  return res.sendStatus(204);
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
