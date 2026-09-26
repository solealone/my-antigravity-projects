
import os
import re

directory = '/Users/user/.gemini/antigravity/scratch/solar-inverter-oem-dashboard'

# Insert "Devices" link after "Dashboard" in all files
pattern = r'(<a href="index\.html" class="nav-item.*?">.*?<span>Dashboard</span>\s*</a>)'
replacement = r'\1\n                <a href="devices.html" class="nav-item">\n                    <i class="ph ph-cpu"></i>\n                    <span>Devices</span>\n                </a>'

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r') as file:
            content = file.read()
        
        # Avoid duplicate insertion
        if 'href="devices.html"' not in content:
            new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            if new_content != content:
                with open(filepath, 'w') as file:
                    file.write(new_content)
                print(f"Updated {filename}")
        else:
            print(f"Skipped {filename} (already exists)")
