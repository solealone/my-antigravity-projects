import os
from PIL import Image

img_path = "/Users/user/.gemini/antigravity/scratch/Transight_Presentation/media__1775730274008.png"
if os.path.exists(img_path):
    with Image.open(img_path) as img:
        print(f"media__1775730274008.png size: {img.size}, Mode: {img.mode}")
        # Let's check some pixel columns to see if there is color/content
        # Let's save a copy in the transight-redesign folder for testing.
        dst_path = "/Users/user/.gemini/antigravity/scratch/transight-redesign/media_644.png"
        img.save(dst_path)
        print("Saved to transight-redesign/media_644.png")
else:
    print("Image not found!")
