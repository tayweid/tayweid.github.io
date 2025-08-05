#!/usr/bin/env python3
import os
import re

# The current pencil SVG
old_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g fill="currentColor">
            <path d="M20.71 5.29l-2-2c-.39-.39-1.02-.39-1.41 0l-1.21 1.21 3.41 3.41 1.21-1.21c.39-.38.39-1.02 0-1.41zM3 18.5V22h3.5l10.09-10.09-3.41-3.41L3 18.5z"/>
            <path d="M14.5 10.5l-7 7c-.5.5-1.5.5-2 0l-.5-.5c-.5-.5-.5-1.5 0-2l7-7M7 18c0 .5.2 1 .5 1.3.4.4 1 .7 1.5.7h3c1 0 2-.3 2.8-.8.4-.3.8-.6 1.2-1.2" opacity="0.5"/>
            <path d="M8 19c0 .3.1.5.3.7l1 1c.2.2.4.3.7.3h2c.6 0 1.2-.2 1.7-.5.3-.2.5-.4.8-.8" opacity="0.3"/>
        </g>
    </svg>'''

# The new hand writing with pencil SVG
new_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g fill="currentColor">
            <path d="M18.64 4.75L20 6.11l-7.79 7.79-1.36-1.36 7.79-7.79m0-2c-.51 0-1.02.2-1.41.59l-7.79 7.79c-.78.78-.78 2.05 0 2.83l1.36 1.36c.39.39.9.59 1.41.59.51 0 1.02-.2 1.41-.59l7.79-7.79c.78-.78.78-2.05 0-2.83l-1.36-1.36c-.39-.39-.9-.59-1.41-.59zM7 14.25c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3z"/>
            <path d="M10.5 19.5c0 .6-.2 1.2-.5 1.6-.2.3-.4.5-.7.7-.4.2-.8.3-1.3.3-1 0-2-.4-2.8-1 .4-.1.8-.3 1.1-.5.4-.3.7-.8.7-1.3 0-1.1.9-2 2-2 .6 0 1.1.2 1.5.7z" opacity="0.3"/>
        </g>
    </svg>'''

def update_file(filepath):
    """Update the SVG icon in a single file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Normalize whitespace in both the pattern and replacement
    old_pattern = re.sub(r'\s+', r'\\s*', re.escape(old_svg))
    
    # Count occurrences
    count = len(re.findall(old_pattern, content))
    
    if count > 0:
        # Replace the icon
        content = re.sub(old_pattern, new_svg, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return count
    return 0

def main():
    # Update files in econ-0100
    econ_0100_files = [
        'econ-0100/part-a.html',
        'econ-0100/part-b.html', 
        'econ-0100/part-c.html',
        'econ-0100/part-d.html',
        'econ-0100/part-e.html',
        'econ-0100/part-f.html'
    ]
    
    # Update files in econ-0150
    econ_0150_files = [
        'econ-0150/part-1.html',
        'econ-0150/part-2.html',
        'econ-0150/part-3.html',
        'econ-0150/part-4.html',
        'econ-0150/part-5.html',
        'econ-0150/part-6.html'
    ]
    
    all_files = econ_0100_files + econ_0150_files
    
    print("Updating pencil icons to hand writing icons...")
    total_replaced = 0
    
    for filepath in all_files:
        full_path = f'/Users/taylorjweidman/PROJECTS/tayweid.github.io/{filepath}'
        if os.path.exists(full_path):
            count = update_file(full_path)
            if count > 0:
                print(f"  ✓ Updated {filepath}: {count} icon(s) replaced")
                total_replaced += count
        else:
            print(f"  ✗ File not found: {filepath}")
    
    print(f"\nTotal: {total_replaced} icons replaced")

if __name__ == "__main__":
    main()