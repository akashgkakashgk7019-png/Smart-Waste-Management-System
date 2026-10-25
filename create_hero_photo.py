import os
from PIL import Image, ImageEnhance

def create_photorealistic_hero():
    # Target banner dimensions
    target_w, target_h = 2400, 1000

    # 1. Base photographic layer from real 4000x3000 Vidhana Soudha photo
    src_path = "public/assets/vidhana_soudha.jpg"
    base_img = Image.open(src_path).convert("RGB")

    # Crop panoramic view focusing on Vidhana Soudha, Cubbon Park trees & sky
    crop_x1 = 200
    crop_y1 = 450
    crop_x2 = 3800
    crop_y2 = 2050
    cropped = base_img.crop((crop_x1, crop_y1, crop_x2, crop_y2))
    
    # Resize to target 2400x1000 with high-quality Lanczos resampling
    hero = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # 2. Professional environmental color grading:
    color_enhancer = ImageEnhance.Color(hero)
    hero = color_enhancer.enhance(1.18)
    contrast_enhancer = ImageEnhance.Contrast(hero)
    hero = contrast_enhancer.enhance(1.08)
    brightness_enhancer = ImageEnhance.Brightness(hero)
    hero = brightness_enhancer.enhance(1.03)

    # 3. Convert back to RGBA if needed or keep RGB
    hero_rgba = hero.convert("RGBA")

    # 4. Subtle Dark Navy Gradient Vignette on Left (preserves text readability)
    # The right side is 100% natural photo scenery without any bins or illustrations
    vignette = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    from PIL import ImageDraw
    vig_draw = ImageDraw.Draw(vignette)

    navy_r, navy_g, navy_b = 8, 22, 40 # #081628
    for x in range(1200):
        if x < 400:
            alpha = int(235 * 0.95)
        else:
            t = (x - 400) / 800.0
            factor = max(0.0, min(1.0, 1.0 - t))
            alpha = int(235 * 0.95 * factor)
        vig_draw.line([(x, 0), (x, target_h)], fill=(navy_r, navy_g, navy_b, alpha))

    hero_final = Image.alpha_composite(hero_rgba, vignette)

    # Convert back to RGB and save optimized high-res JPEG
    final_img = hero_final.convert("RGB")
    out_path = "public/assets/smartwaste_hero_photo.jpg"
    final_img.save(out_path, format="JPEG", quality=94, optimize=True)
    print(f"Clean photorealistic hero background generated successfully at {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == "__main__":
    create_photorealistic_hero()
