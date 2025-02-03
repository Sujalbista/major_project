import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-blue-600 dark:bg-gray-800 p-4">
      <h1 className="text-3xl text-white dark:text-gray-100 text-center mb-6">
        SketchStyle AI
      </h1>
      <nav>
        <ul className="flex justify-center space-x-6">
          <li>
            <Link
              to="/#how-it-works"
              className="text-white dark:text-gray-300 hover:text-blue-300 dark:hover:text-blue-500"
            >
              How It Works
            </Link>
          </li>
          <li>
            <Link
              to="/#gallery"
              className="text-white dark:text-gray-300 hover:text-blue-300 dark:hover:text-blue-500"
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link
              to="/#pricing"
              className="text-white dark:text-gray-300 hover:text-blue-300 dark:hover:text-blue-500"
            >
              Pricing
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="text-white dark:text-gray-300 hover:text-blue-300 dark:hover:text-blue-500"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="text-white dark:text-gray-300 hover:text-blue-300 dark:hover:text-blue-500"
            >
              Register
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
