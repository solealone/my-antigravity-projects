import os
import shutil

src_dir = "/Users/user/.gemini/antigravity/scratch/Transight_Presentation"
dst_dir = "/Users/user/.gemini/antigravity/scratch/transight-redesign"

mapping = {
    "media__1775730274008.png": "stack_cand1.png", # 644x677
    "media__1775730250329.png": "stack_cand2.png", # 646x799
    "media__1775730261158.png": "stack_cand3.png", # 630x738
    "media__1775729467151.png": "stack_cand4.png", # 603x691
    "media__1775730286470.png": "stack_cand5.png", # 600x627
}

for src_name, dst_name in mapping.items():
    src_path = os.path.join(src_dir, src_name)
    dst_path = os.path.join(dst_dir, dst_name)
    if os.path.exists(src_path):
        shutil.copy(src_path, dst_path)
        print(f"Copied {src_name} to {dst_name}")
    else:
        print(f"File {src_name} not found!")
