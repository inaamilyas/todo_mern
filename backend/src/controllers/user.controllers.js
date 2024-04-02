const User = require("../models/user.model.js");
const CryptoJS = require("crypto-js");

const encryptPassword = (plaintext) => {
  const key = "dhf43rufiofdusidjfn324wdjkdf92erds";
  const iv = "chxjkdfhhre4324h";
  let encryptedPassword = CryptoJS.AES.encrypt(
    plaintext,
    CryptoJS.enc.Utf8.parse(key),
    {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      size: 256,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();
  return encryptedPassword;
};

const registerUser = async (req, res) => {
  const user = req.body.user;
  const password = encryptPassword(user.password);
  try {
    const newUser = await User.create({ ...user, password });
    res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(500).json(err);
  }
};

const loginUser = async (req, res) => {
  const user = req.body.user;
  try {
    const savedUser = await User.findOne({ email: user.email });
    if (!savedUser) {
      res.status(404).json({ message: "User not found!" });
    }

    const encPassword = encryptPassword(user.password);

    if (savedUser.password !== encPassword) {
      res.status(404).json({ message: "Password is incorrect!" });
    }
    
    res.status(200).json({ message: "Logged in successfully", result });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { registerUser };
