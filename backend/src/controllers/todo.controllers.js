const Todo = require("../models/todo.models.js");

const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSingleTodo = async (req, res) => {
  const id = req.params.id;
  try {
    const todo = await Todo.findById(id);
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateTodo = async (req, res) => {
  const id = req.params.id;
  const changes = req.body.todo;
  try {
    const todo = await Todo.findByIdAndUpdate(
      id,
      {
        $set: {
          ...changes,
        },
      },
      { new: true }
    );
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteTodo = async (req, res) => {
  const id = req.params.id;
  try {
    const todo = await Todo.findByIdAndDelete(id);
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getTodoByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const todos = await Todo.find({ user: userId });
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json(err);
  }
};

const addTodo = async (req, res) => {
    const todo = req.body.todo;
    console.log(todo);
    try {
        const newTodo = await Todo.create(todo);
        res.status(200).json({message:"Todo added successfully",todo:newTodo});
    } catch (err) {
        res.status(500).json(err);
    }
};


module.exports = {
    getAllTodos,
    getSingleTodo,
    updateTodo,
    deleteTodo,
    getTodoByUser,
    addTodo,
}
