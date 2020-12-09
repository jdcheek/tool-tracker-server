const User = require("../models/user.model");
const userCtrl = {};

userCtrl.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error });
  }
};

userCtrl.updateUser = async (req, res) => {
  const updateUser = {};
  updateUser.username = req.body.username;
  updateUser.isAdmin = req.body.isAdmin;
  if (req.body.password !== "") {
    updateUser.password = await User.encryptPassword(req.body.password);
  }
  try {
    await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updateUser },
      { new: true }
    );
    res.status(200).send({ message: "User updated" });
  } catch (error) {
    res.status(400).send({ error });
  }
};

userCtrl.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.params.id });
    res.status(200).send({ message: "User deleted" });
  } catch (error) {
    res.status(400).send({ error });
  }
};

userCtrl.getUserById = async (req, res) => {
  try {
    const user = await User.findOne(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(400).send({ error });
  }
};

userCtrl.updateItemCheckedOut = async (req, res) => {
  try {
    const { id, tool_number, location, user, checkIn } = await req.body;
    if (checkIn === true) {
      const dbUser = await User.findOne({ username: user });
      const filteredCheckedOutArray = await dbUser.toolsCheckedOut.filter(
        (tool) => tool.id !== id
      );
      await User.findOneAndUpdate(
        { username: user },
        { toolsCheckedOut: filteredCheckedOutArray }
      );
      res.status(200).send({ message: `${tool_number} checked in by ${user}` });
    } else {
      await User.findOneAndUpdate(
        { username: user },
        { $push: { toolsCheckedOut: { id, tool_number, location } } }
      );
      res
        .status(200)
        .send({ message: `${tool_number} checked out by ${user}` });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = userCtrl;
