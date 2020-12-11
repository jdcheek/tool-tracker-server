const User = require("../models/user.model");
const authCtrl = {};

authCtrl.registerUser = async (req, res) => {
  const newUser = new User(req.body);
  try {
    newUser.password = await User.encryptPassword(newUser.password);
    await newUser.save();
    res.status(201).send({ created: true });
  } catch (error) {
    res.status(400).send({ error });
  }
};

authCtrl.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByCredentials(username, password);
    const token = await user.generateAuthToken();
    res.status(200);
    res.cookie("tooltrackerapp", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.send({ username: user.username, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(400).send({ error });
  }
};

authCtrl.logOutUser = (req, res) => {
  try {
    res.clearCookie("tooltrackerapp");
    res.send({ message: `Logged out successfully` });
  } catch (error) {
    res.status(400).send({ error });
  }
};

authCtrl.getUserStatus = async (req, res) => {
  try {
    if (req.header("cookie")) {
      const token = await req.header("cookie").replace("tooltrackerapp=", "");
      const user = await User.findByToken(token);
      if (user.message === "Unauthorized Access") {
        res.status(401).send(user.message);
      } else {
        res.status(200).send({
          isLoggedIn: true,
          isAdmin: user.isAdmin,
          username: user.username,
          id: user._id,
          toolsCheckedOut: user.toolsCheckedOut,
        });
      }
    } else {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = authCtrl;
