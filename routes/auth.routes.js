const { Router } = require("express");
const router = Router();
const {
  loginUser,
  logOutUser,
  getUserStatus,
} = require("../controllers/auth.controller");
const user = require("../middleware/user");

router.post("/login", loginUser);
router.get("/logout", logOutUser);
router.get("/status", user, getUserStatus);

module.exports = router;
