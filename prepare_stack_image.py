import os
import numpy as np
from PIL import Image, ImageFilter

src_path = "/Users/user/.gemini/antigravity/scratch/transight-redesign/stack_cand2.png"
if not os.path.exists(src_path):
    src_path = "/Users/user/.gemini/antigravity/brain/54399b60-d06d-473d-8ae7-0eac0eee1753/media__1784268293658.png"

dst_path = "/Users/user/.gemini/antigravity/scratch/transight-redesign/clean_stack.png"

with Image.open(src_path) as img:
    img = img.convert("RGBA")
    width, height = img.size
    
    # Create an alpha mask to smoothly fade the outer edges to black/transparent
    # Create a grayscale mask image
    mask = Image.new("L", (width, height), 255)
    
    # Draw a black border and blur it to create a smooth fade
    margin_x = int(width * 0.08)
    margin_y = int(height * 0.08)
    
    # Create vignette mask
    mask_arr = np.ones((height, width), dtype=np.float32)
    
    for y in range(height):
        for x in range(width):
            # Distance from edges
            dist_x = min(x, width - 1 - x) / margin_x if margin_x > 0 else 1.0
            dist_y = min(y, height - 1 - y) / margin_y if margin_y > 0 else 1.0
            
            edge_factor = min(1.0, max(0.0, min(dist_x, dist_y)))
            # Smooth step curve
            smooth_factor = edge_factor * edge_factor * (3 - 2 * edge_factor)
            mask_arr[y, x] = smooth_factor
            
    # Apply mask to alpha channel
    r, g, b, a = img.split()
    a_np = np.array(a, dtype=np.float32) / 255.0
    final_a_np = (a_np * mask_arr * 255.0).astype(np.uint8)
    
    final_a = Image.fromarray(final_a_np, mode="L")
    img.putalpha(final_a)
    
    img.save(dst_path)
    print(f"Saved vignetted clean stack image to {dst_path}")
