import os
from PIL import Image

logo_path = "/Users/user/.gemini/antigravity/scratch/transight-redesign/particle_logo.png"
if os.path.exists(logo_path):
    with Image.open(logo_path) as img:
        img = img.convert("RGBA")
        datas = img.getdata()
        
        new_data = []
        for item in datas:
            # item is (r, g, b, a)
            r, g, b, a = item
            
            # Since the background is dark reddish/black:
            # Let's compute the brightness. If it is very dark, make it transparent.
            # We can use a threshold.
            brightness = (r * 299 + g * 587 + b * 114) / 1000
            
            if brightness < 30:
                # Fade out completely dark pixels
                new_data.append((0, 0, 0, 0))
            elif brightness < 60:
                # Smoothly fade out dark-reddish background pixels
                alpha_factor = (brightness - 30) / 30
                new_data.append((r, g, b, int(255 * alpha_factor)))
            else:
                new_data.append((r, g, b, 255))
                
        img.putdata(new_data)
        img.save(logo_path)
        print("Successfully made particle_logo.png background transparent!")
else:
    print("particle_logo.png not found!")
