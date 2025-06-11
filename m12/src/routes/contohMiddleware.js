const express = require("express");
const router = express.Router();
const middleware = require("../Middleware");

const {
  adminPage,
  managerPage,
  visitorPage,
  tesAPIKey,
  topup,
} = require("../controller/contohMiddleware");

const {
  checkAPIKey,
  rateLimit,
  logAccess,
  cekQuota,
  kurangiQuota,
} = require("../Middleware/apiKey");

router.get(
  "/admin",
  [middleware.verifyJWT, middleware.checkRoles("admin")],
  adminPage
);
router.get(
  "/manager",
  [middleware.verifyJWT, middleware.checkRoles("admin", "manager")],
  managerPage
);
router.get(
  "/visitor",
  [middleware.verifyJWT, middleware.checkRoles("admin", "manager", "visitor")],
  visitorPage
);

router.get(
  "/tesAPIKey",
  [checkAPIKey, rateLimit, logAccess, cekQuota, kurangiQuota],
  tesAPIKey
);

router.get("/topup", [checkAPIKey], topup);

module.exports = router;
