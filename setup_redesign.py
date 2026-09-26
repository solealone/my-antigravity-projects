import os
import shutil

src_img = "/Users/user/.gemini/antigravity/brain/54399b60-d06d-473d-8ae7-0eac0eee1753/media__1784268293658.png"
dst_dir = "/Users/user/.gemini/antigravity/scratch/transight-redesign"
dst_img = os.path.join(dst_dir, "telematics_stack.png")

if not os.path.exists(dst_dir):
    os.makedirs(dst_dir)

if os.path.exists(src_img):
    shutil.copy(src_img, dst_img)
    print(f"Copied telematics stack image to {dst_img}")
else:
    print(f"Source image not found at {src_img}")
