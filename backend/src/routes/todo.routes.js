const { Router } = require("express");
const jwt = require("jsonwebtoken")
const User = require("../models/user.model.js")

const Accesskey = "hdhjfewrdcrewr98er32gherah434n";
const verifyToken =  async ( req, res, next)=>{
    try {
    //   console.log("verify at" ,req.cookies.accessToken)
    //   console.log("verify at" ,req.header("Authorization")?.replace("Bearer ", ""))
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!accessToken){
            console.log("invalid token | 1")
            return res.status(401).send({message:"Unauthorize request"})
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
        // console.log(error)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({ error: 'Token expired', tokenExpired: true });
          }
        return res.status(500).send({message:"Internal server error"})
    }
}

const {
  getAllTodos,
  getSingleTodo,
  updateTodo,
  deleteTodo,
  getTodoByUser,
  addTodo,
} = require("../controllers/todo.controllers.js");

const router = Router();

router.route("/").get(verifyToken,getAllTodos);
router.route("/add").post(verifyToken,addTodo);
router.route("/:id").get(getSingleTodo);
router.route("/update/:id").post(verifyToken,updateTodo);
router.route("/delete/:id").delete(verifyToken,deleteTodo);
router.route("/user/:id").post(getTodoByUser);

module.exports = router;
