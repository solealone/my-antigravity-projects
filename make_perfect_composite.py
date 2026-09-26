import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

def make_composite():
    # Load images
    img1_path = "/Users/user/.gemini/antigravity/brain/32a0b441-7526-43de-bd07-06ae165d7d66/media__1784541829918.png"
    img2_path = "/Users/user/.gemini/antigravity/brain/32a0b441-7526-43de-bd07-06ae165d7d66/media__1784541853108.png"
    diagram_path = "/Users/user/.gemini/antigravity/brain/32a0b441-7526-43de-bd07-06ae165d7d66/media__1784542691027.jpg"

    img1 = Image.open(img1_path).convert("RGBA")
    img2 = Image.open(img2_path).convert("RGBA")
    diagram = Image.open(diagram_path).convert("RGBA")

    width, height = img2.size # 1024 x 551

    # 1. Prepare base background & header & text from img2
    base = img2.copy()

    # Remove Gemini watermarks in bottom right
    bg_patch = img1.crop((450, height - 120, 1024, height))
    base.paste(bg_patch, (450, height - 120))

    # 2. Enhance particle logo glow on right side
    particle_crop_img1 = img1.crop((600, 50, 1000, 500))
    particle_np = np.array(particle_crop_img1)
    r, g, b, a = particle_np[:,:,0], particle_np[:,:,1], particle_np[:,:,2], particle_np[:,:,3]
    pink_lum = np.maximum(0, r.astype(int) - g.astype(int)/2 - b.astype(int)/2)
    pink_alpha = np.clip(pink_lum * 2.2, 0, 255).astype(np.uint8)
    particle_np[:,:,3] = np.maximum(particle_np[:,:,3], pink_alpha)
    particle_img = Image.fromarray(particle_np)
    base.paste(particle_img, (600, 50), particle_img.split()[3])

    # 3. Process the exact 3D diagram (diagram_path: 1024x1024)
    # Crop to diagram content
    diagram_cropped = diagram.crop((40, 60, 980, 960)) # 940 x 900
    
    diag_w = 440
    diag_h = int(diagram_cropped.height * (diag_w / diagram_cropped.width))
    diagram_resized = diagram_cropped.resize((diag_w, diag_h), Image.LANCZOS)

    diag_np = np.array(diagram_resized)
    r_d, g_d, b_d, _ = diag_np[:,:,0], diag_np[:,:,1], diag_np[:,:,2], diag_np[:,:,3]
    max_rgb = np.maximum(r_d, np.maximum(g_d, b_d))
    
    alpha = np.clip((max_rgb.astype(float) - 15) * 1.3, 0, 255).astype(np.uint8)
    
    h_d, w_d = alpha.shape
    margin = 30
    edge_mask = np.ones((h_d, w_d), dtype=float)
    edge_mask[:margin, :] *= np.linspace(0, 1, margin)[:, None]
    edge_mask[-margin:, :] *= np.linspace(1, 0, margin)[:, None]
    edge_mask[:, :margin] *= np.linspace(0, 1, margin)[None, :]
    edge_mask[:, -margin:] *= np.linspace(1, 0, margin)[None, :]

    alpha = (alpha * edge_mask).astype(np.uint8)
    diag_np[:,:,3] = alpha
    diagram_final = Image.fromarray(diag_np)

    left_bg = Image.new("RGBA", (500, height), (12, 3, 7, 255))
    base.paste(left_bg, (0, 0))

    pos_x = 30
    pos_y = (height - diag_h) // 2 + 20
    base.paste(diagram_final, (pos_x, pos_y), diagram_final.split()[3])

    # Re-overlay top navigation bar from img2
    top_nav = img2.crop((0, 0, width, 70))
    base.paste(top_nav, (0, 0))

    # Save output
    out_path = "/Users/user/.gemini/antigravity/brain/32a0b441-7526-43de-bd07-06ae165d7d66/transight_exact_composite.jpg"
    base.convert("RGB").save(out_path, quality=98)
    print("Composite created successfully at:", out_path)

if __name__ == "__main__":
    make_composite()
