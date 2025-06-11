const express = require("express");
const {
  qSederhana,
  iqSederhana,
  uqSederhana,
  dqSederhana,
} = require("../controller/bukuORM");
const router = express.Router();

router.get("/qSederhana", qSederhana);
router.post("/iqSederhana", iqSederhana);
router.put("/uqSederhana/:buku_id", uqSederhana);
router.delete("/dqSederhana/:buku_id", dqSederhana);

module.exports = router;
