const { default: mongoose, Schema } = require("mongoose");

const TodoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default:false
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;
