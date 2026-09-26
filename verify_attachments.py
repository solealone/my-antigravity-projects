import os
from PIL import Image

dir_path = "/Users/user/.gemini/antigravity/brain/54399b60-d06d-473d-8ae7-0eac0eee1753"
files = ["media__1784268207581.png", "media__1784268293658.png"]
for file in files:
    img_path = os.path.join(dir_path, file)
    if os.path.exists(img_path):
        with Image.open(img_path) as img:
            print(f"File: {file}, Size: {img.size}, Format: {img.format}, Mode: {img.mode}")
    else:
        print(f"File {file} does not exist.")
