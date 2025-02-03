# generate_image.py
import sys
import os
from PIL import Image  # You can install it using `pip install pillow`

def process_image(input_path, output_path, prompt):  # Add prompt parameter
    try:
        img = Image.open(input_path)
        print(f"Paths:{input_path},{output_path},{prompt}")
        # Simulate AI processing (replace with actual AI model when ready)
        print(f"Simulating AI processing with prompt: {prompt}")  # Print the prompt for verification

        # Placeholder AI logic (for now, just rotate and save)
        img = img.rotate(45)  # Example rotation

        img.save(output_path)
        return output_path
    except FileNotFoundError:
        print(f"Error: Input file not found: {input_path}")
        return None  # Indicate failure
    except Exception as e:
        print(f"Error during image processing: {e}")
        return None  # Indicate failure


if __name__ == "__main__":
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    prompt = sys.argv[3]  # Get the prompt from command-line arguments

    output_path = process_image(input_file, output_file, prompt)

    if output_path:
        print(f"output_path is: {output_path}")
    else:
        sys.exit(1)  # Indicate failure to the Node.js process