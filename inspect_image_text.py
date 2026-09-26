import os
from PIL import Image

image_path = "/Users/user/.gemini/antigravity/scratch/transight-redesign/telematics_stack.png"
if os.path.exists(image_path):
    with Image.open(image_path) as img:
        img_rgb = img.convert("RGB")
        width, height = img_rgb.size
        print(f"Image size: {width}x{height}")
        # Search the top 50 pixels for reddish/pinkish colors
        # HSL accent pink is around (255, 0, 60), let's check for R > 150 and G < 100 and B < 120
        red_pixels = []
        for y in range(min(50, height)):
            for x in range(width):
                r, g, b = img_rgb.getpixel((x, y))
                if r > 120 and g < 100 and b < 100:
                    red_pixels.append((x, y, (r, g, b)))
        print(f"Found {len(red_pixels)} reddish pixels in the top 50 rows.")
        if red_pixels:
            print("Sample reddish pixels at the top:", red_pixels[:5])
else:
    print("telematics_stack.png not found!")
