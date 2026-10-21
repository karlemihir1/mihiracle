import os
from PIL import Image, ImageDraw

def create_mihiracle_icon(size, output_path):
    # Create RGBA canvas
    img = Image.new('RGBA', (size, size), color=(0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Outer squircle
    radius = int(size * 0.22)
    # Background navy: #192D3A -> (25, 45, 58)
    draw.rounded_rectangle([0, 0, size, size], radius=radius, fill=(25, 45, 58, 255))
    
    # Inner badge geometry: Gem / Stash Box
    center_x = size / 2.0
    center_y = size * 0.48
    box_w = size * 0.58
    box_h = size * 0.52
    
    # Points
    top = (center_x, center_y - box_h * 0.5)
    left = (center_x - box_w * 0.5, center_y - box_h * 0.15)
    right = (center_x + box_w * 0.5, center_y - box_h * 0.15)
    mid = (center_x, center_y + box_h * 0.15)
    bottom = (center_x, center_y + box_h * 0.65)
    b_left = (center_x - box_w * 0.5, center_y + box_h * 0.35)
    b_right = (center_x + box_w * 0.5, center_y + box_h * 0.35)
    
    # Top diamond (Mint bright: #B8E7BF -> 184, 231, 191)
    draw.polygon([top, right, mid, left], fill=(184, 231, 191, 255))
    
    # Left flank (#8FD89B -> 143, 216, 155)
    draw.polygon([left, mid, bottom, b_left], fill=(143, 216, 155, 230))
    
    # Right flank (#5EB872 -> 94, 184, 114)
    draw.polygon([mid, right, b_right, bottom], fill=(94, 184, 114, 255))
    
    # Central spark (White circle + small cross)
    spark_r = size * 0.045
    draw.ellipse([center_x - spark_r, mid[1] - spark_r, center_x + spark_r, mid[1] + spark_r], fill=(255, 255, 255, 255))
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, 'PNG')
    print(f"Generated {output_path} ({size}x{size})")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    icons_dir = os.path.join(base_dir, 'public', 'icons')
    create_mihiracle_icon(192, os.path.join(icons_dir, 'icon-192.png'))
    create_mihiracle_icon(512, os.path.join(icons_dir, 'icon-512.png'))
    create_mihiracle_icon(180, os.path.join(icons_dir, 'apple-touch-icon.png'))
    create_mihiracle_icon(180, os.path.join(base_dir, 'public', 'apple-touch-icon.png'))
