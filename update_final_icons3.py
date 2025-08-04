#!/usr/bin/env python3
import re
from pathlib import Path

# Updated SVG icons
ICONS = {
    # Lightbulb with external rays for Episode/Tutorial
    'lightbulb': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <path d="M9 18c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-16C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V16c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-1.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V15h-4v-1.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
    </svg>''',
    
    # Hand holding and writing with pencil for Vignette/Example
    'pencil': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        <path d="M12.5 15.5c0 0 1.5 1 2.5 1.5s2 1 2 2.5c0 1-0.5 2-1.5 2.5s-3 1-5 1s-4-0.5-5-1.5c-0.5-0.5-0.5-1-0.5-1.5c0-1 1-1.5 2-2s3-1.5 4-2" opacity="0.6"/>
    </svg>''',
    
    # Keep document with folded corner for Reading
    'document': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
    </svg>''',
    
    # Keep checkbox with checkmark for Homework
    'checkbox': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>'''
}

def identify_icon_type(svg_content):
    """Identify which type of icon this is based on path content"""
    # Current lightbulb (with star rays or line rays)
    if 'M9 21c0 .55.45 1 1 1h4' in svg_content or 'M9 18c0 .55.45 1 1 1h4' in svg_content:
        return 'lightbulb'
    # Current document
    elif 'M14 2H6c-1.1 0-1.99' in svg_content:
        return 'document'
    # Current pencil
    elif 'M3 17.25V21h3.75L17.81' in svg_content:
        return 'pencil'
    # Current checkbox
    elif 'M19 3H5c-1.11 0-2 .9-2 2v14' in svg_content:
        return 'checkbox'
    return None

def update_all_icons(filepath):
    """Update all indicator icons in HTML file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Find all SVG elements within indicator tabs
    svg_pattern = r'(<button class="indicator-tab(?:\s+active)?" data-index="\d+">)<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">.*?</svg>'
    
    def replace_svg(match):
        button_tag = match.group(1)
        svg_content = match.group(0)
        
        icon_type = identify_icon_type(svg_content)
        if icon_type and icon_type in ICONS:
            return button_tag + ICONS[icon_type]
        return match.group(0)
    
    content = re.sub(svg_pattern, replace_svg, content, flags=re.DOTALL)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    """Update all HTML files in econ-0100 and econ-0150 directories"""
    base_dir = Path('/Users/taylorjweidman/PROJECTS/tayweid.github.io')
    
    updated_files = []
    for course_dir in ['econ-0100', 'econ-0150']:
        course_path = base_dir / course_dir
        if course_path.exists():
            for html_file in course_path.glob('part-*.html'):
                if update_all_icons(html_file):
                    updated_files.append(html_file)
                    print(f"Updated: {html_file.name}")
    
    print(f"\nTotal files updated: {len(updated_files)}")

if __name__ == '__main__':
    main()