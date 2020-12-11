const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const user = async (req, res, next) => {
  try {
    const token = await req.header("cookie").replace("tooltrackerapp=", "");
    const decoded = jwt.verify(token, process.env.AUTHTOKENSTRING);
    if (decoded) {
      next();
    } else {
      res.status(401).send({ message: "Unauthorized Access" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = user;
