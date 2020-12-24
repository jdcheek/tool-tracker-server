const User = require("../models/user.model");
const authCtrl = {};

authCtrl.registerUser = async (req, res) => {
  const newUser = new User(req.body);
  const retypedPassword = req.body.retypedPassword;
  console.log(newUser);
  if (newUser.username.length < 3) {
    res.status(400).send({ message: "Please enter a valid username" });
    return;
  }
  if (newUser.password.length < 8) {
    res.status(400).send({ message: "Please enter a valid password" });
    return;
  }
  if (newUser.password !== retypedPassword) {
    console.log(newUser.password, newUser.retypedPassword);
    res.status(400).send({ message: "Passwords do not match" });
    return;
  }

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
    res.clearCookie("tooltrackerapp", {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
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
