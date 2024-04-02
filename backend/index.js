const express = require('express');
const cors = require('cors');
const dbConnection = require("./src/db/index.js")

const app = express();

const todoRouter = require("./src/routes/todo.routes.js")
const userRouter = require("./src/routes/user.routes.js")

app.use(cors());
app.use(express.json())

dbConnection();

app.use("/api/todos", todoRouter)
app.use("/api/users", userRouter)



app.listen(5000, () => {
  console.log('Serrver is listening on port 5000!');
});