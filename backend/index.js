const express = require('express');
const cors = require('cors');
const dbConnection = require("./src/db/index.js")
const cookieParser = require('cookie-parser');

const app = express();

const todoRouter = require("./src/routes/todo.routes.js")
const userRouter = require("./src/routes/user.routes.js")

app.use(cors({
  // origin: "http://your-react-app-domain.com", 
  origin: true, 
  credentials: true,
}));
app.use(express.json())
app.use(cookieParser());


dbConnection();

app.use("/api/todos", todoRouter)
app.use("/api/users", userRouter)



app.listen(5000, () => {
  console.log('Serrver is listening on port 5000!');
});