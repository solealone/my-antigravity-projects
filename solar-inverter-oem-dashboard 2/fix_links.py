
import os
import re

# Define the directory
directory = '/Users/user/.gemini/antigravity/scratch/solar-inverter-oem-dashboard'

# Define the pattern to match the "Add Inverter" link block
# We look for href="index.html" followed by the add icon/text
# We want to change the href to "add-inverter.html"
pattern = r'(<a href=")index\.html(" class="nav-item">\s*<i class="ph ph-plus-circle"></i>\s*<span>Add Inverter</span>)'
replacement = r'\1add-inverter.html\2'

# Iterate over all files in the directory
for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        
        with open(filepath, 'r') as file:
            content = file.read()
        
        # Perform replacement
        new_content = re.sub(pattern, replacement, content)
        
        # Write back if changed
        if new_content != content:
            with open(filepath, 'w') as file:
                file.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"No change in {filename}")
