# React + Vite

# My Project

## Steps to run the project on Windows

1. Clone the repository to your local machine.

   ```batch
   git clone https://github.com/Sujalbista/major_project.git
   cd major_project

   ```

2. Run the install.bat script

3. For Database
```
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
XAMPP
-- Create the database
CREATE DATABASE major_database;

-- Use the newly created database
USE major_database;

-- Create the 'user' table
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Auto-incrementing primary key
    name VARCHAR(100) NOT NULL,        -- User's name, cannot be null
    email VARCHAR(100) NOT NULL UNIQUE, -- User's email, must be unique
    password VARCHAR(255) NOT NULL      -- User's password
);

-- Create the 'image_logs' table
CREATE TABLE image_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-incrementing primary key
    user_id INT NOT NULL,               -- Foreign key to the 'user' table
    prompt TEXT NOT NULL,               -- Prompt for the generated image
    original_image VARCHAR(255) NOT NULL, -- Path or URL to the original image
    generated_image VARCHAR(255) NOT NULL, -- Path or URL to the generated image
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of log creation
    FOREIGN KEY (user_id) REFERENCES user(id) -- Foreign key constraint
);


