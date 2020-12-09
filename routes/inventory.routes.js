const express = require("express");
const { getInventory, createInventory, getInventoryById, deleteInventory, updateInventory, updateStatus } = require("../controllers/inventory.controller");
const router = express.Router();
const Inventory = require("../models/inventory.model");
const auth = require('../middleware/auth')
const user = require('../middleware/user')

router.get("/", getInventory);
router.post("/add", auth, createInventory);
router.get("/:id", auth, getInventoryById);
router.delete("/:id", auth, deleteInventory);
router.post("/update/:id", user, updateInventory);
router.post("/update/status/:id", user, updateStatus);

module.exports = router;
