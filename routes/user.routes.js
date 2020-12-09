const express = require("express");
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  updateItemCheckedOut,
} = require("../controllers/user.controller");
const { registerUser } = require("../controllers/auth.controller");
const auth = require("../middleware/auth");
const user = require("../middleware/user");

router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.post("/add", auth, registerUser);
router.delete("/delete/:id", auth, deleteUser);
router.post("/update/:id", auth, updateUser);
router.post("/tools", user, updateItemCheckedOut);

module.exports = router;
