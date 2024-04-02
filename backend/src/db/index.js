const { default: mongoose } = require("mongoose")

const dbConnection = async()=>{
    const url = "mongodb://localhost:27017/todos"
    try {
        const connectionInstance =  await mongoose.connect(url)
        console.log("connection to database successful", connectionInstance.connection.host);
    } catch (error) {
        console.log("Database connection Error", error);
    }
}

module.exports = dbConnection