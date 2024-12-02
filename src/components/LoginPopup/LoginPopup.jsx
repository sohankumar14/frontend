import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import axios from 'axios';

const LoginPopup = ({ setShowLogin, handleLogin }) => {
  const [currState, setCurrState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://localhost:3001/users", {
        name,
        email,
        password,
      });
      if (response.status === 201) {
        setMessage("Account created successfully! Please login.");
        setCurrState("Login");
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      setMessage("Sign Up failed. Try again.");
    }
  };

  const handleLoginRequest = async () => {
    try {
      const response = await axios.get("http://localhost:3001/users");
      const user = response.data.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        handleLogin(user);
        setMessage("");
      } else {
        setMessage("Invalid credentials.");
      }
    } catch (error) {
      setMessage("Login failed. Try again.");
    }
  };

  return (
    <div className="login-popup">
      <div className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={currState === "Login" ? handleLoginRequest : handleSignUp}>
          {currState === "Login" ? "Login" : "Create account"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
        {message && <p className="login-popup-message">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPopup;
 