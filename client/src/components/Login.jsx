import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  // Receive the onLogin prop
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address.";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required.";
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/login",
          formData
        );
        setLoginStatus("Login successful!");

        // Store the token and user data in local storage
        localStorage.setItem("token", response.data.token); // Assuming your backend sends a token
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user data

        // Call the onLogin callback to update the login status in App.js
        if (onLogin) {
          onLogin(response.data.user, response.data.token); // Pass user data and token
        }

        navigate("/"); // Redirect after successful login
      } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        setLoginStatus(error.response?.data?.error || "Login failed.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm">{formErrors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm">{formErrors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        {loginStatus && (
          <p
            className={`mt-4 text-sm font-medium text-center ${
              loginStatus.includes("successful")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {loginStatus}
          </p>
        )}
      </div>
    </div>
  );
}
export default Login;
