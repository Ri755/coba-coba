const express = require("express");
const router = express.Router();

const {
    fetchapi,
    postData,
    singleData,
    updateData,
    deleteData,
    queryAnime,
    productApi,
} = require("../controller/contohAxios");

router.get("/fetch", fetchapi);
router.get("/singleData", singleData);
router.post("/post", postData);
router.put("/update/:id", updateData);
router.delete("/delete/:id", deleteData);
router.get("/queryAnime", queryAnime);
router.get("/product/:id", productApi);

module.exports = router;