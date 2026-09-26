
import os
import re

directory = '/Users/user/.gemini/antigravity/scratch/solar-inverter-oem-dashboard'

# Insert "Analytics" link after "Devices" in all files
# Check if "Analytics" link already exists to avoid duplication
pattern = r'(<a href="devices\.html" class="nav-item.*?">.*?<span>Devices</span>\s*</a>)'
replacement = r'\1\n                <a href="analytics.html" class="nav-item">\n                    <i class="ph ph-trend-up"></i>\n                    <span>Analytics</span>\n                </a>'

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r') as file:
            content = file.read()
        
        # Avoid duplicate insertion if 'href="analytics.html"' exists
        if 'href="analytics.html"' not in content:
            new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            if new_content != content:
                with open(filepath, 'w') as file:
                    file.write(new_content)
                print(f"Updated {filename}")
        else:
             print(f"Skipped {filename} (already exists)")
