const express = require("express");

const app = express();

const bukuRouter = require("./src/routes/buku");
const bukuORMRouter = require("./src/routes/bukuORM");
const contohRelasiRouter = require("./src/routes/contohRelasi");
const bukuValidasiRouter = require("./src/routes/validasi");
const contohAxiosRouter = require("./src/routes/contohAxios");
const contohAuthRouter = require("./src/routes/auth");
const contohMiddlewareRouter = require("./src/routes/contohMiddleware");
const uploadFileRouter = require("./src/routes/uploadFile");

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//jalankan routernya
app.use("/api/v1/buku", bukuRouter);
app.use("/api/v1/bukuORM", bukuORMRouter);
app.use("/api/v1/contohRelasi", contohRelasiRouter);
app.use("/api/v1/validasi", bukuValidasiRouter);
app.use("/api/v1/axios", contohAxiosRouter);
app.use("/api/v1/auth", contohAuthRouter);
app.use("/api/v1/middleware", contohMiddlewareRouter);
app.use("/api/v1/uploadFile", uploadFileRouter);

// const crypto = require("crypto");
// const secretKey = crypto.randomBytes(64).toString("hex");
// console.log("Generated", secretKey);

//listen
const port = 3000;
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
