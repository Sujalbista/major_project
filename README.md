# SketchStyleAI

This project demonstrates a deep learning approach to generating realistic clothing images based on a combination of hand-drawn sketches and textual descriptions. Utilizing Stable Diffusion with ControlNet, the system takes a sketch and a descriptive prompt as input and outputs a high-quality, contextually accurate image of the clothing item.

# Features

Generate clothing images conditioned on both sketch input and text description

Combines visual structure (from sketches) with semantic meaning (from text)

Uses Stable Diffusion + ControlNet for controllable image generation

Trained on custom datasets of clothing sketches, images, and text labels

Evaluation metrics include FID, SSIM, CLIP, and FSIM for quality validation

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


```
