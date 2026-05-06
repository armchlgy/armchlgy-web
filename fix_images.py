import os
import shutil
import glob

print("INITIATING IMAGE EXTRACTION PROTOCOL...")

# Source directory containing the AI generated images
source_dir = "/Users/muhammadluthfiagam/.gemini/antigravity/brain/181d05ad-b2ee-48d3-9855-2cbc2c4ca305"

# The specific files we generated
image_files = [
    "the_ozone_shield_1778045336474.png",
    "the_concrete_anchor_1778045350798.png",
    "the_cold_arrival_1778045363739.png",
    "tier_1_box_1778045390792.png",
    "tier_2_box_1778045406512.png",
    "tier_3_box_1778045421212.png",
    "the_blank_dossier_gift_card_1778042237429.png"
]

# Target directory
assets_dir = "assets"
if not os.path.exists(assets_dir):
    os.makedirs(assets_dir)

# 1. Copy the files
print("\nExtracting tactical visual assets to public folder...")
for img in image_files:
    src_path = os.path.join(source_dir, img)
    dst_path = os.path.join(assets_dir, img)
    
    if os.path.exists(src_path):
        shutil.copy(src_path, dst_path)
        print(f"[SUCCESS] Copied {img}")
    else:
        print(f"[WARNING] Could not find {img} in source directory.")

# 2. Update HTML files
print("\nReprogramming HTML architecture to use local assets...")
html_files = glob.glob("*.html")
prefix_to_replace = "file:///Users/muhammadluthfiagam/.gemini/antigravity/brain/181d05ad-b2ee-48d3-9855-2cbc2c4ca305/"

for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    if prefix_to_replace in content:
        new_content = content.replace(prefix_to_replace, "assets/")
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"[UPDATED] {filepath}")

print("\nPROTOCOL COMPLETE. Images have been localized. Ready for Global Deployment.")
