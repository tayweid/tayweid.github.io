#!/usr/bin/env python3
import re
import glob

# Get all course HTML files
files = glob.glob("econ-*/part-*.html")

def add_downloads_to_card(card_html):
    """Check if card has downloads section, add if missing"""
    
    # Check if this card already has card-downloads
    if 'class="card-downloads"' in card_html:
        return card_html, False
    
    # Extract title for logging
    title_match = re.search(r'<h3 class="card-title">(.*?)</h3>', card_html)
    title = title_match.group(1) if title_match else "Unknown"
    
    # Find where to insert the downloads div
    # Look for the closing tag of card-description
    desc_pattern = r'(</p>\s*)(\s*</div>\s*</div>)'
    
    if re.search(r'<p class="card-description">', card_html):
        # Has description, add after it
        replacement = r'\1\n                        <div class="card-downloads">\n                        </div>\2'
        new_card = re.sub(desc_pattern, replacement, card_html)
        return new_card, True
    else:
        # No description, add after title
        title_pattern = r'(</h3>\s*)(\s*</div>\s*</div>)'
        replacement = r'\1\n                        <div class="card-downloads">\n                        </div>\2'
        new_card = re.sub(title_pattern, replacement, card_html)
        return new_card, True

for filepath in files:
    print(f"\nProcessing {filepath}...")
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Find all carousel cards
    card_pattern = r'<div class="carousel-card"[^>]*>[\s\S]*?</div>\s*</div>\s*</div>'
    cards = re.findall(card_pattern, content)
    
    cards_updated = 0
    new_content = content
    
    for card in cards:
        updated_card, was_updated = add_downloads_to_card(card)
        if was_updated:
            new_content = new_content.replace(card, updated_card)
            cards_updated += 1
            
            # Extract title for logging
            title_match = re.search(r'<h3 class="card-title">(.*?)</h3>', card)
            title = title_match.group(1) if title_match else "Unknown"
            print(f"  - Added downloads to: {title}")
    
    if cards_updated > 0:
        # Write the updated content
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"  ✓ Updated {cards_updated} cards in {filepath}")
    else:
        print(f"  - All cards already have downloads section")