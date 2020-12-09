const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    isAdmin: {
      required: true,
      default: false,

      type: Boolean,
    },
    toolsCheckedOut: [],
    token: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    } else {
      throw new Error({ error: "Invalid Credentials" });
    }
  } else {
    console.log('No user');
    throw new Error({ error: "User not found" });
  }
};

userSchema.statics.findByToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.AUTHTOKENSTRING);
    if (decoded) {
      const dbUser = await User.findById(decoded._id)
      return dbUser
    } else {
      return ({ message: 'Unauthorized Access' })
    }
  } catch (error) {
    throw new Error(error)
  }
}

userSchema.statics.encryptPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.generateAuthToken = async function () {
  user = this;

  try {
    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.AUTHTOKENSTRING, { expiresIn: '1h' }
    );
    return token;
  } catch (error) {
    throw new Error(error)
  }

};

const User = mongoose.model("User", userSchema);

module.exports = User;
