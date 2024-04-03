import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:5000/api/users/login", {
      user: {
        email,
        password,
      }
    }, { withCredentials: true });

    console.log(response);
    if (response.status === 200) {
        navigate("/");
      } else {
        console.error(response.data.error || "Login failed");
      }
  };

  return (
    <div className="w-full p-10">
      <div className="container mx-auto w-full">
        <h1>Login</h1>
        
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
  )
}

export default Login