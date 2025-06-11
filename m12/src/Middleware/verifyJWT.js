const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Header tidak ada" });
  }
  //console.log(authHeader);
  //console.log("Akses token secret "+process.env.ACCESS_TOKEN_SECRET);

  // kenapa di split? karena bentuknya Bearer <lalu token kalian disini, makanya pakai index ke 1>
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: "Invalid Token" });
    }
    // Ini penting, agar kita bisa kasi tau middleware checkRoles data penggunanya, TERMASUK ROLE NYA
    req.pengguna = decoded.pengguna;
    next();
  });
  //console.log(authHeader);
  //console.log("Akses token secret "+process.env.ACCESS_TOKEN_SECRET);
};

module.exports = verifyJWT;
