import React, { useEffect, useState } from "react";
import axios from "axios";
import FileUpload from "./components/FileUpload";
import Register from "./components/Register";
import Login from "./components/Login";
import UserLogs from "./components/UserLogs";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FeatureShowcase from "./components/Features";

// Define types for user data and token
interface User {
  id: string;
  username: string;
  email: string;
}

function App() {
  const [serverMessage, setServerMessage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [serverStatus, setServerStatus] = useState<string>("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
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

    checkServerStatus();
    const intervalId = setInterval(checkServerStatus, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const handleLogin = (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Store user data in localStorage
    navigate("/"); // Navigate to home page after login
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
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="hero-section bg-gray-900 flex flex-col justify-center items-center p-12 flex-grow">
                <div className="mb-12">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl leading-tight">
                    Turn Your{" "}
                    <span className="text-blue-400">Fashion Ideas</span> into
                    Reality
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl text-center">
                    Create and visualize your clothing designs in seconds with
                    our AI-powered platform!
                  </p>
                  <div className="mb-8 p-3 px-5 bg-gray-800/70 rounded-full inline-flex items-center border border-gray-700">
                    <span className="text-gray-300 mr-2">Server Status:</span>
                    <span
                      className={`${
                        serverStatus === "running"
                          ? "text-green-400"
                          : "text-red-400"
                      } font-semibold flex items-center`}
                    >
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          serverStatus === "running"
                            ? "bg-green-400"
                            : "bg-red-400"
                        }`}
                      ></span>
                      {serverMessage}
                    </span>
                  </div>
                </div>

                <div className="max-w-5xl w-full mx-auto">
                  <FileUpload user={user} isLoggedIn={isLoggedIn} />
                </div>
              </div>

              <FeatureShowcase />
            </>
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

      <Footer />
    </div>
  );
}

export default App;
