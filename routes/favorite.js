const express = require("express");
const router = express.Router();
const controller = require("../controllers/favoriteCont");
const passport = require("passport");
// Роуты авторизации
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.all
);
router.patch(
  "/change",
  passport.authenticate("jwt", { session: false }),
  controller.change
);

module.exports = router;
