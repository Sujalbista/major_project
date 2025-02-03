const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import JWT library
const db = require("../db"); // Adjust path as needed

const secretKey = process.env.JWT_SECRET || "your_secret_key"; // **IMPORTANT:** Use a strong, randomly generated secret and store it securely (environment variables are best).  DO NOT hardcode secrets in your code.

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

router.post("/register", async (req, res) => {
  // ... (registration logic - same as before)

  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    // Check if username or email is already registered
    const [existingRows] = await db.query(
      "SELECT * FROM user WHERE name = ? OR email = ?",
      [username, email]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({
        message: existingRows.some((user) => user.name === username)
          ? "Username already registered."
          : "Email already registered.",
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await db.query(
      "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    return res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Error during registration:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM user WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    if (!user.password) {
      console.error("Error: User record missing password hash:", email);
      return res
        .status(500)
        .json({ error: "Server error: Password not found" }); // More specific error
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // JWT Generation (Improved)
    const payload = { userId: user.id }; // Create the JWT payload
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" }); // Sign with payload, secret, and options

    // Send the token and user data (Improved)
    res.json({
      message: "Login successful",
      token, // Send the token
      user: {
        id: user.id,
        email: user.email,
        // Add other NON-sensitive user data here as needed (e.g., username)
        // Do NOT send the password hash back to the client!
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Server error during login" }); // More specific error
  }
});

router.post("/check-availability", async (req, res) => {
  // ... (check availability logic - same as before)

  const { username, email } = req.body;

  try {
    // Validate email format
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Check availability of username or email
    let query = "";
    let value = "";

    if (username) {
      query = "SELECT * FROM user WHERE name = ?";
      value = username;
    } else if (email) {
      query = "SELECT * FROM user WHERE email = ?";
      value = email;
    } else {
      return res.status(400).json({ message: "Invalid input" });
    }

    const [rows] = await db.query(query, [value]);

    if (rows.length > 0) {
      return res.status(200).json({
        message: username
          ? "Username already registered."
          : "Email already registered.",
      });
    }

    return res.status(200).json({
      message: username ? "Username is available." : "Email is available.",
    });
  } catch (err) {
    console.error("Error checking availability:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
