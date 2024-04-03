import React from "react";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const mainUrl = "http://localhost:5000/api";
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState("");
  const navigate = useNavigate();

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${mainUrl}/todos`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setTodos([...response.data]);
      }
    } catch (error) {
      if (error.response.data.tokenExpired) {
        navigate("/login");
      }
    }
  };

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  // Add To Do
  const handleAdd = async () => {
    try {
      const response = await axios.post(
        `${mainUrl}/todos/add`,
        {
          todo: { title },
        },
        { withCredentials: true }
      );

      console.log(response);
      if (response.status == 401 && response.data.tokenExpired) {
        navigate("/login");
      }

      if (response.status == 200) {
        setTodos([...todos, response.data.todo]);
      }
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  const handleEdit = (_, id) => {
    setIsEdit(true);
    setId(id);
    let t = todos.filter((i) => i._id === id);
    setTitle(t[0].title);
  };

  const updateTodo = async () => {
    try {
      const response = await axios.request(
        {
          method: "POST",
          url: `${mainUrl}/todos/update/${id}`,
          data: {
            todo: { title },
          },
        },
        { withCredentials: true }
      );

      if (response.status == 401 && response.data.tokenExpired) {
        navigate("/login");
      }

      console.log(response.data);
      fetchTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckbox = async (id, status) => {
    const newTodo = await axios.post(
      `${mainUrl}/todos/update/${id}`,
      {
        data: { todo: { status: status } },
      },
      { withCredentials: true }
    );
    fetchTodos();
  };

  const handleDelete = async (_, id) => {
    const response = await axios.delete(`${mainUrl}/todos/delete/${id}`, {
      withCredentials: true,
    });
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
      <h1 className="font-bold text-center text-3xl">To Do App</h1>
      <div className="addTodo my-5 flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Add a Todo</h2>
        <div className="flex">
          <input
            onChange={handleChange}
            value={title}
            type="text"
            className="w-full rounded-full px-5 py-1"
          />
          <button
            onClick={isEdit ? updateTodo : handleAdd}
            disabled={title.length <= 3}
            className="bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white"
          >
            Save
          </button>
        </div>
      </div>
      {/* <input
          className="my-4"
          id="show"
          onChange={toggleFinished}
          type="checkbox"
          checked={showFinished}
        />
        <label className="mx-2" htmlFor="show">
          Show Finished
        </label> */}
      <div className="h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2"></div>
      <h2 className="text-2xl font-bold">Your Todos</h2>
      <div className="todos">
        {todos.length === 0 && <div className="m-5">No Todos to display</div>}
        {todos.map((item) => {
          return (
            // (showFinished || !item.status) && (
            <div key={item._id} className={"todo flex my-3 justify-between"}>
              <div className="flex gap-5">
                <input
                  // name={item._id}
                  onChange={() => handleCheckbox(item._id, !item.status)}
                  type="checkbox"
                  checked={item.status}
                  id=""
                />
                <div className={item.status ? "line-through" : ""}>
                  {item.title}
                </div>
              </div>
              <div className="buttons flex h-full">
                <button
                  onClick={(e) => handleEdit(e, item._id)}
                  className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={(e) => {
                    handleDelete(e, item._id);
                  }}
                  className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                >
                  <AiFillDelete />
                </button>
              </div>
            </div>
            // )
          );
        })}
      </div>
    </div>
  );
}

export default Home;
