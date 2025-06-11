const express = require("express");
const {
  validasiUser,
  updatePengguna,
  validasiCustom,
} = require("../controller/validasi");
const router = express.Router();

router.post("/user", validasiUser);
router.put("/user/:id", updatePengguna);
router.get("/custom", validasiCustom);

module.exports = router;
