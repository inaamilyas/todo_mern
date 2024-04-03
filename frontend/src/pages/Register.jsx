import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.request({
      method: "POST",
      url: "http://localhost:5000/api/users/register",
      data: {
        user: {
          fullname,
          username,
          email,
          password,
        },
      },
    });

    console.log(response.data);
    if (response.status === 200) {
        navigate("/login");
      } else {
        console.error(response.data.error || "Registration failed");
      }
  };

  return (
    <div className="w-full p-10">
      <div className="container mx-auto w-full">
        <h1>Register</h1>
        <input
          type="text"
          placeholder="Enter your full name"
          onChange={(e) => {
            setFullname(e.target.value);
          }}
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Enter your username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <br />
        <br />
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <br />
        <br />
        <input type="submit" value="Register" onClick={handleSubmit} />
      </div>
    </div>
  );
}

export default Register;
