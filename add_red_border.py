import os
from PIL import Image, ImageOps

image_path = "/Users/user/.gemini/antigravity/scratch/transight-redesign/telematics_stack.png"
if os.path.exists(image_path):
    with Image.open(image_path) as img:
        # Add a 2px red border around the image
        bordered_img = ImageOps.expand(img, border=2, fill="red")
        bordered_img.save(image_path)
        print("Added a red border to telematics_stack.png")
else:
    print("telematics_stack.png not found!")
