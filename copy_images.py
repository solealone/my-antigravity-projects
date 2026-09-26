import os
import shutil

src_dir = "/Users/user/.gemini/antigravity/scratch/Transight_Presentation"
dst_dir = "/Users/user/.gemini/antigravity/brain/54399b60-d06d-473d-8ae7-0eac0eee1753"

if not os.path.exists(dst_dir):
    os.makedirs(dst_dir)

for file in os.listdir(src_dir):
    if file.endswith(".png"):
        src_path = os.path.join(src_dir, file)
        dst_path = os.path.join(dst_dir, file)
        shutil.copy(src_path, dst_path)
        print(f"Copied {file} to artifacts directory.")
