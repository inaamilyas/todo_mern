const jwt = require('jsonwebtoken');
const { default: mongoose, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    refreshToken:{
        type:String,
    }
  },
  { timestamps: true }
);

const Accesskey = "hdhjfewrdcrewr98er32gherah434n";
const Refreshkey = "hdhjfewrdcrdf4erewr98er32434n";
const Resetkey = "hdhjfewrdcrdf4erewr98er32434n";
userSchema.methods.generateAccessToken =  function () {
  const token =  jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    Accesskey,
    {
      expiresIn: 100,
    }
  );

  return token
};

userSchema.methods.generateRefreshToken =  function () {
  const token =  jwt.sign(
    {
      _id: this._id,
    },
    Refreshkey,
    {
      expiresIn: 86400,
    }
  );
  return token
};

userSchema.methods.generatePassResetToken =  function () {
  const token =  jwt.sign(
    {
      _id: this._id,
      email:this.email
    },
    Resetkey,
    {
      expiresIn: 300,
    }
  );
  return token
};

const User = mongoose.model("User", userSchema);

module.exports = User;
