const jwt = require("jsonwebtoken");
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

const generateAccessRefreshToken = async (userId) => {
  console.log(userId);
  try {
    const user = await User.findById(userId);
    // console.log(user);
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    user.refreshToken = refreshToken;
    // console.log("Saving token to db");
    await user.save({ validateBeforeSave: false });
    // console.log("response : ", res);
    return { refreshToken, accessToken };
  } catch (error) {
    console.log("error in generating access and refresh token");
    console.log(error);
  }
};

const registerUser = async (req, res) => {
  console.log("inside register");
  const user = req.body.user;
  const password = encryptPassword(user.password);
  try {
    const newUser = await User.create({
      ...user,
      password,
    });
    return res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const loginUser = async (req, res) => {
  const user = req.body.user;
  try {
    const savedUser = await User.findOne({ email: user.email });
    if (!savedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    const encPassword = encryptPassword(user.password);

    if (savedUser.password !== encPassword) {
      return res.status(404).json({ message: "Password is incorrect!" });
    }

    const { accessToken, refreshToken } = await generateAccessRefreshToken(
      savedUser._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };
    // console.log("before setting cookies in login");
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .send({
        message: "Logged in successfully",
        savedUser,
        accessToken,
        refreshToken,
      });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .send({ user: {}, message: "User logged Out" });
};

const forgetPassword = async (req, res) => {
  const user = req.body.user;
  try {
    const savedUser = await User.findOne({ email: user.email });
    if (!savedUser) {
      console.log("User not found");
      return res.sendStatus(401).send({ message: "user does not exist" });
    }

    // console.log(savedUser);
    const token = await savedUser.generatePassResetToken();

    // send verification link
    const link = `localhost:5000/api/users/reset-password/${token}`;
    console.log(link);

    return res.status(200).send({ message: "Check your mail", link });
  } catch (error) {
    console.log(error);
    res.sendStatus(500).send({ message: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const resetToken = req.params.resetToken;
    const Resetkey = "hdhjfewrdcrdf4erewr98er32434n";
    const decodedToken = jwt.verify(resetToken, Resetkey);
    const userId = decodedToken._id;

    const user = await User.findById(userId);
    user.password = encryptPassword(password);
    const updatedUser = await user.save();

    return res
      .status(200)
      .send({ message: "Password changed successfully", user: updatedUser });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong while changing password" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgetPassword,
  logoutUser,
  resetPassword,
};
