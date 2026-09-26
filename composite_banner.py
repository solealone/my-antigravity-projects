import sys
from PIL import Image

img1_path = "/Users/user/.gemini/antigravity/brain/32a0b441-7526-43de-bd07-06ae165d7d66/media__1784541829918.png"
img2_path = "/Users/user/.gemini/antigravity/brain/32a0b441-7526-43de-bd07-06ae165d7d66/media__1784541853108.png"
diagram_path = "/Users/user/.gemini/antigravity/brain/32a0b441-7526-43de-bd07-06ae165d7d66/media__1784542691027.jpg"

img1 = Image.open(img1_path)
img2 = Image.open(img2_path)
diagram = Image.open(diagram_path)

print(f"img1 size: {img1.size}")
print(f"img2 size: {img2.size}")
print(f"diagram size: {diagram.size}")
