const { Router } = require("express");
const {registerUser,loginUser, forgetPassword,logoutUser,resetPassword} = require("../controllers/user.controllers.js")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model.js")


const router = Router();

const Accesskey = "hdhjfewrdcrewr98er32gherah434n";
const verifyToken =  async (req, res, next)=>{
    try {
        // console.log(req.cookies?.accessToken);
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!accessToken){
            console.log("invalid token")
            res.status(401).send({message:"Unauthorize request"})
        }
    
        const decodeToken = jwt.verify(accessToken, Accesskey)
        if(!decodeToken){
            console.log("token verification failed")
            res.status(401).send({message:"Unauthorize request"})
        }
    
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
        if(!user){
            console.log("user not found for this token")
            res.status(401).send({message:"Invalid Access Token"})
        }
        
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"Internal server error"})
    }
}


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken,logoutUser);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password/:resetToken").post(resetPassword);


module.exports = router;