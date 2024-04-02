const { Router } = require("express");

const {
  getAllTodos,
  getSingleTodo,
  updateTodo,
  deleteTodo,
  getTodoByUser,
  addTodo,
} = require("../controllers/todo.controllers.js");

const router = Router();

router.route("/").get(getAllTodos);
router.route("/add").post(addTodo);
router.route("/:id").get(getSingleTodo);
router.route("/update/:id").post(updateTodo);
router.route("/delete/:id").delete(deleteTodo);
router.route("/user/:id").post(getTodoByUser);

module.exports = router;
