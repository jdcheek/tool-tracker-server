const {
  findByIdAndDelete,
  findById,
  findOneAndUpdate,
} = require("../models/inventory.model");
const Inventory = require("../models/inventory.model");
const inventoryCtrl = {};

inventoryCtrl.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.status(200).send(inventory);
  } catch (error) {
    res.status(500).send(error);
  }
};

inventoryCtrl.createInventory = async (req, res) => {
  try {
    const { tool_number, description, location, status } = await req.body;
    const item = new Inventory({
      tool_number,
      description,
      location,
      status,
    });
    item.save();
    res.status(200).send({ itemCreated: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

inventoryCtrl.getInventoryById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    res.status(200).send(item);
  } catch (error) {
    res.status(400).send(error);
  }
};

inventoryCtrl.deleteInventory = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete({
      _id: req.params.id,
    });
    res.status(200).send({ itemDeleted: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

inventoryCtrl.updateInventory = async (req, res) => {
  const { tool_number, description, location, status } = await req.body;
  try {
    await Inventory.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { tool_number, description, location, status } }
    );
    res.status(200).send({ itemUpdated: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

inventoryCtrl.updateStatus = async (req, res) => {
  const status = await req.body;
  try {
    await Inventory.findOneAndUpdate({ _id: req.params.id }, { $set: status });
    res.status(200).send({ itemUpdated: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = inventoryCtrl;
