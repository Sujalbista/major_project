import React, { useEffect, useState } from "react";

import axios from "axios";
import FileUpload from "./components/FileUpload.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import UserLogs from "./components/UserLogs.jsx";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";

function App() {
  const [serverMessage, setServerMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [serverStatus, setServerStatus] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    }

    const checkServerStatus = () => {
      axios
        .get("http://localhost:5000/api/test")
        .then((response) => {
          setServerMessage(response.data.message);
          setServerStatus("running");
        })
        .catch((error) => {
          console.error("Error connecting to the server:", error);
          setServerMessage("Server not running");
          setServerStatus("not-running");
        });
    };

    checkServerStatus(); // Check server status when component mounts
    const intervalId = setInterval(checkServerStatus, 10000); // Check every 10 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleLogin = (userData, token) => {
    setIsLoggedIn(true);
    setUser(userData);
    navigate("/");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="App font-sans text-center bg-gray-900 min-h-screen flex flex-col text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 py-4">
        <div className="flex justify-center space-x-6">
          <Link to="/" className="text-blue-400 hover:text-blue-600">
            Home
          </Link>
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-blue-400 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-600"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/logs")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                My Logs
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <div className="hero-section bg-gray-900 flex flex-col justify-center items-center p-12 flex-grow">
              <h1 className="text-4xl font-semibold text-white mb-4">
                Turn Your Fashion Ideas into Reality
              </h1>
              <p className="text-lg text-gray-300 mb-6">
                Create and visualize your clothing designs in seconds!
              </p>
              <p className="text-green-400 text-xl mb-6">
                Server Status:{" "}
                <span
                  className={`${
                    serverStatus === "running"
                      ? "text-green-600"
                      : "text-red-600"
                  } font-semibold`}
                >
                  {serverMessage}
                </span>
              </p>
              <FileUpload user={user} isLoggedIn={isLoggedIn} />
            </div>
          }
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/logs"
          element={
            isLoggedIn ? <UserLogs user={user} /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
