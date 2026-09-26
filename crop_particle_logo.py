import os
from PIL import Image

src_img_path = "/Users/user/.gemini/antigravity/brain/54399b60-d06d-473d-8ae7-0eac0eee1753/media__1784268207581.png"
dst_dir = "/Users/user/.gemini/antigravity/scratch/transight-redesign"
dst_img_path = os.path.join(dst_dir, "particle_logo.png")

if os.path.exists(src_img_path):
    with Image.open(src_img_path) as img:
        # Image dimensions: (1024, 524)
        # Let's crop the right part containing the particle pin logo.
        # Looking at the original screenshot:
        # The logo is centered vertically on the right half.
        width, height = img.size
        # Crop box: (left, upper, right, lower)
        # Let's take the right 40% of the width, and almost the full height but crop out the top navigation and bottom area if needed.
        # Logo seems to occupy from x=600 to 950 and y=120 to 450.
        box = (620, 100, 980, 480)
        cropped_img = img.crop(box)
        cropped_img.save(dst_img_path)
        print(f"Cropped particle logo saved to {dst_img_path} with size {cropped_img.size}")
else:
    print("Source image not found.")
