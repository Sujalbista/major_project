// server.js
const path = require("path");
const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import JWT library
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Serve static files from the uploads directory

// Ensure the uploads directory exists

app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());
const secretKey = process.env.JWT_SECRET || "your_secret_key"; // **IMPORTANT:** Use a strong, randomly generated secret and store it securely (environment variables are best).  DO NOT hardcode secrets in your code.

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
const authenticate = (req, res, next) => {
  console.log("Inside authenticate middleware"); // Add this log

  const token = req.header("Authorization")?.split(" ")[1];
  console.log("Token from header:", token); // Log the token

  if (!token) {
    console.log("No token provided"); // Log if no token
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    console.log("Secret Key used for verification:", secretKey); // Log secret key

    const decoded = jwt.verify(token, secretKey);
    console.log("Decoded token:", decoded); // Log the decoded token

    req.user = decoded.userId;
    console.log("User ID set on request:", req.user); // Log the user ID

    next();
  } catch (err) {
    console.error("JWT verification error:", err); // Log the *full* error object
    res.status(401).json({ message: "Token is not valid", error: err.message }); // Send error message to frontend
  }
};

app.get("/api/test", (req, res) => {
  // You can modify the message as per your needs
  const serverStatus = {
    message: "Server is on", // This is the message sent to the frontend
  };
  res.json(serverStatus);
});
app.post("/api/register", async (req, res) => {
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

app.post("/api/login", async (req, res) => {
  console.log(secretKey);
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

app.post("/api/check-availability", async (req, res) => {
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

app.post(
  "/api/upload",
  upload.single("image"),
  authenticate,
  async (req, res) => {
    const file = req.file;
    const prompt = req.body.prompt;
    const userId = req.user;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const originalImagePath = path.join("uploads", file.filename);
    const generatedImagePath = path.join(
      "uploads",
      `generated_${file.filename}`
    );

    fs.renameSync(file.path, originalImagePath); // Rename file after path is correct

    const pythonProcess = spawn("venv\\Scripts\\python", [
      "generate_image.py",
      originalImagePath,
      generatedImagePath,
      prompt,
    ]);

    let pythonStdout = ""; // Capture stdout
    let pythonStderr = ""; // Capture stderr

    pythonProcess.stdout.on("data", (data) => {
      pythonStdout += data.toString(); // Convert Buffer to string
      console.log(`Python (stdout): ${data}`); // Log to server console
    });

    pythonProcess.stderr.on("data", (data) => {
      pythonStderr += data.toString(); // Convert Buffer to string
      console.error(`Python (stderr): ${data}`); // Log errors to server console
    });

    pythonProcess.on("close", async (code) => {
      console.log(`Python process exited with code ${code}`); // Log exit code

      if (code === 0) {
        try {
          // Construct URL paths – ensure correct base URL
          const originalImageUrl = `/uploads/${file.filename}`; // Relative path
          const generatedImageUrl = `/uploads/generated_${file.filename}`; // Relative path

          await db.query(
            "INSERT INTO image_logs (user_id, prompt, original_image, generated_image, timestamp) VALUES (?,?,?,?, NOW())",
            [userId, prompt, originalImageUrl, generatedImageUrl]
          );

          res.json({
            message: "Image processed and log saved successfully",
            generatedImage: generatedImageUrl, // Send relative URL
            originalFile: originalImageUrl, // Send relative URL
          });
        } catch (dbError) {
          console.error("Error saving log to database:", dbError);
          res.status(500).json({ error: "Error saving log" });
        }
      } else {
        console.error("Python process exited with code", code);
        console.error("Python stderr output:", pythonStderr); // Log stderr for debugging

        res.status(500).json({
          error: "Error processing image",
          pythonError: pythonStderr, // Include Python error in response
        });
      }
    });

    pythonProcess.on("error", (err) => {
      console.error("Error starting Python script:", err);
      res.status(500).json({ error: "Error starting Python process" });
    });
  }
);
app.get("/api/logs/:userId", authenticate, async (req, res) => {
  const userId = req.params.userId;

  try {
    const [logs] = await db.query(
      "SELECT * FROM image_logs WHERE user_id = ? ORDER BY timestamp DESC",
      [userId]
    );

    // Prepend localhost URL to image paths
    const logsWithFullPath = logs.map((log) => ({
      id: log.id, // <-- explicitly add ID
      userId: log.user_id,
      createdAt: log.timestamp,
      prompt: log.prompt,
      originalImage: `http://localhost:5000${log.original_image}`,
      generatedImage: `http://localhost:5000${log.generated_image}`,
    }));

    res.json({ logs: logsWithFullPath });
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Error fetching logs" });
  }
});
app.delete("/api/logs/:logId", authenticate, async (req, res) => {
  const logId = req.params.logId;

  try {
    const [result] = await db.query("DELETE FROM image_logs WHERE id = ?", [
      logId,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Log not found" });
    }

    res.json({ message: "Log deleted successfully" });
  } catch (err) {
    console.error("Error deleting log:", err);
    res.status(500).json({ error: "Error deleting log" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000; // Use environment port or 5000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;

// Check if the email is a valid Gmail address
// const emailValid = await gmail_check.verifyGmailAddress(email);
// if (!emailValid) {
//   return res
//     .status(400)
//     .json({ message: "The Gmail address is invalid or does not exist" });
// }

// Validate Gmail email format
// if (email && !email.endsWith("@gmail.com")) {
//   return res
//     .status(400)
//     .json({ message: "Only Gmail addresses are allowed." });
// }

// Check if Gmail exists
// if (email) {
//   try {
//     const emailValid = await gmail_check.verifyGmailAddress(email);
//     if (!emailValid) {
//       return res.status(400).json({
//         message: "The Gmail address is invalid or does not exist",
//       });
//     }
//   } catch (gmailErr) {
//     console.error("Error verifying Gmail address:", gmailErr);
//     return res
//       .status(500)
//       .json({ message: "Error checking Gmail validity." });
//   }
// }
