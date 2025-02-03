import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [registerStatus, setRegisterStatus] = useState("");
  const [availability, setAvailability] = useState({ username: "", email: "" });

  const handleChange = async (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === "username" || name === "email") {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/check-availability",
          { [name]: value }
        );
        setAvailability((prev) => ({
          ...prev,
          [name]: response.data.message,
        }));
      } catch (error) {
        setAvailability((prev) => ({
          ...prev,
          [name]:
            error.response?.data?.message || "Error checking availability",
        }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = "Username is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
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
          "http://localhost:5000/api/register",
          formData
        );
        setRegisterStatus(response.data.message);
      } catch (error) {
        setRegisterStatus(
          error.response?.data?.message || "Registration failed. Try again."
        );
      }
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {availability.username && (
              <p
                className={`text-sm ${
                  availability.username.includes("available")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {availability.username}
              </p>
            )}
            {formErrors.username && (
              <p className="text-red-500 text-sm">{formErrors.username}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {availability.email && (
              <p
                className={`text-sm ${
                  availability.email.includes("available")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {availability.email}
              </p>
            )}
            {formErrors.email && (
              <p className="text-red-500 text-sm">{formErrors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full p-3 mt-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm">{formErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
          >
            Register
          </button>
        </form>

        <p
          className={`mt-4 text-sm font-medium text-center ${
            registerStatus.includes("success")
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {registerStatus}
        </p>
      </div>
    </div>
  );
}

export default Register;
