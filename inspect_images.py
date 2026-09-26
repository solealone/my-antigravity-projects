import os
from PIL import Image

dir_path = "/Users/user/.gemini/antigravity/scratch/Transight_Presentation"
for file in sorted(os.listdir(dir_path)):
    if file.endswith(".png"):
        img_path = os.path.join(dir_path, file)
        try:
            with Image.open(img_path) as img:
                print(f"File: {file}, Size: {img.size}, Format: {img.format}, Mode: {img.mode}")
        except Exception as e:
            print(f"Error reading {file}: {e}")
