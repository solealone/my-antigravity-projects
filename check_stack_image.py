import os
from PIL import Image

image_path = "/Users/user/.gemini/antigravity/scratch/transight-redesign/telematics_stack.png"
if os.path.exists(image_path):
    with Image.open(image_path) as img:
        print(f"telematics_stack.png size: {img.size}")
        # Check if there are non-black/non-transparent pixels near the borders
        # to see if the image itself is cropped.
        width, height = img.size
        # Sample top, bottom, left, right edges
        top_pixels = [img.getpixel((x, 0)) for x in range(0, width, width // 10)]
        bottom_pixels = [img.getpixel((x, height - 1)) for x in range(0, width, width // 10)]
        print("Top edge pixels:", top_pixels[:5])
        print("Bottom edge pixels:", bottom_pixels[:5])
else:
    print("telematics_stack.png not found!")
