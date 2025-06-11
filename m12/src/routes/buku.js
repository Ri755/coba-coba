const express = require("express");

const {
  getCollection,
  tambahBuku,
  updateBuku,
  deleteBuku,
} = require("../controller/buku");

const router = express.Router();

router.get("/", getCollection);
router.post("/", tambahBuku);
router.put("/:id", updateBuku);
router.delete("/:id", deleteBuku);

module.exports = router;
