const { default: mongoose, Schema } = require("mongoose");


const UserSchema = new Schema({
    fullname:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }, 
},{timestamps:true})

const User = mongoose.model("User", UserSchema);

module.exports = User;