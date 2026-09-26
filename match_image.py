import os
import numpy as np
from PIL import Image

# Path to the user's uploaded 3-layer stack image (low res / cropped)
query_path = "/Users/user/.gemini/antigravity/brain/54399b60-d06d-473d-8ae7-0eac0eee1753/media__1784268293658.png"

# Candidate images from the Transight Presentation directory
candidates_dir = "/Users/user/.gemini/antigravity/scratch/Transight_Presentation"

def get_histogram(img_path):
    with Image.open(img_path) as img:
        # Convert to RGB and resize to a standard size for comparison
        img = img.convert("RGB").resize((128, 128))
        return np.array(img.histogram())

if os.path.exists(query_path):
    query_hist = get_histogram(query_path)
    
    best_match = None
    min_dist = float('inf')
    
    for file in os.listdir(candidates_dir):
        if file.endswith(".png"):
            cand_path = os.path.join(candidates_dir, file)
            try:
                cand_hist = get_histogram(cand_path)
                # Compute Euclidean distance between histograms
                dist = np.linalg.norm(query_hist - cand_hist)
                print(f"File: {file}, Distance: {dist:.2f}")
                if dist < min_dist:
                    min_dist = dist
                    best_match = file
            except Exception as e:
                print(f"Error processing {file}: {e}")
                
    print(f"\nBest matching high-resolution image is: {best_match} (Distance: {min_dist:.2f})")
else:
    print("Query image not found.")
