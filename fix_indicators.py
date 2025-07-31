#!/usr/bin/env python3
import re

# Read the file
with open('econ-0150/part-1.html', 'r') as f:
    content = f.read()

# Pattern to match the carousel and indicator structure
# Looking for the closing of carousel div, followed by indicator div, followed by closing of container
pattern = r'(            </button>\n        </div>\n)(        <div class="carousel-indicator">[\s\S]*?        </div>\n)(    </div>)'

def replacement(match):
    button_and_carousel_close = match.group(1)
    indicator_block = match.group(2)
    container_close = match.group(3)
    
    # Split the button_and_carousel_close to insert indicator before carousel closing div
    parts = button_and_carousel_close.split('</div>')
    # Reconstruct with indicator inside carousel
    return parts[0] + indicator_block + '        </div>\n' + container_close

# Replace all occurrences
new_content = re.sub(pattern, replacement, content)

# Write the updated content
with open('econ-0150/part-1.html', 'w') as f:
    f.write(new_content)

print("Successfully moved all carousel indicators inside their carousel divs")