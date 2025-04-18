# generate_image.py
import sys
import os
from PIL import Image  # You can install it using `pip install pillow`
from diffusers import StableDiffusionControlNetPipeline, ControlNetModel
from diffusers.utils import load_image
import numpy as np
import torch
import traceback

def resize_image_maintain_aspect(image, target_height=512, target_width=512):
    # Get original dimensions
    width, height = image.size

    # Calculate new width while maintaining aspect ratio
    new_width = int((target_height / height) * width)

    # Resize the image
    resized_image = image.resize((target_width, target_height), Image.LANCZOS)
    return resized_image

def process_image(input_path, output_path, prompt):  # Add prompt parameter
    
    try:
        if torch.cuda.is_available():
            print("CUDA is available. Running on:", torch.cuda.get_device_name(0))
        else:
            print("CUDA is NOT available. Running on CPU.")
        print(torch.cuda.memory_summary(device=None, abbreviated=False))
        img = Image.open(input_path)
        print(f"Paths:{input_path},{output_path},{prompt}")
        # Simulate AI processing (replace with actual AI model when ready)
        print(f"Simulating AI processing with prompt: {prompt}")  # Print the prompt for verification
        torch.cuda.empty_cache()
    # Load ControlNet model with torch.float16
        try:
            controlnet = ControlNetModel.from_pretrained("ManojKhanal/controlnet_dresscode",torch_dtype=torch.float16 )

            pipe = StableDiffusionControlNetPipeline.from_pretrained("stabilityai/stable-diffusion-2-1",controlnet=controlnet,torch_dtype=torch.float16).to("cuda")

        except Exception as e:
            print(f"Error loading models: {e}")
            traceback.print_exc()
            return None

    # ✅ Enable memory optimizations
        pipe.enable_attention_slicing()  # ✅ Reduces VRAM usage
        pipe.enable_sequential_cpu_offload()  # ✅ Moves tensors to CPU when not needed
        pipe.enable_model_cpu_offload()  # ✅ Moves layers to CPU to prevent OOM

        pipe.safety_checker = lambda images, clip_input: (images, [False] * len(images))

    # Load input control image
        control_image = load_image(input_path).convert("RGB")
        control_image = resize_image_maintain_aspect(control_image)
    # ✅ Convert image to NumPy & normalize (ensure proper format)
        control_image = np.array(control_image) / 255.0  # Normalize to [0,1]
        control_image = torch.tensor(control_image).permute(2, 0, 1).unsqueeze(0)  # Convert to PyTorch tensor
        control_image = control_image.to("cuda", dtype=torch.float16)  # Move to GPU & use float16

    # ✅ Generate image with correct format
        generated_image = pipe(prompt, image=control_image, num_inference_steps=10).images[0]
        generated_image.save(output_path)
        # Placeholder AI logic (for now, just rotate and save)
        
        return output_path
    except FileNotFoundError:
        print(f"Error: Input file not found: {input_path}")
        return None  # Indicate failure
    except Exception as e:
        print(f"Error during image processing: {e}")
        traceback.print_exc()
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
        
        
        
     