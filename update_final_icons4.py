#!/usr/bin/env python3
import re
from pathlib import Path

# Updated SVG icons based on the references
ICONS = {
    # Lightbulb with radiating lines (similar to Dreamstime reference)
    'lightbulb': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g fill="currentColor">
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
            <path d="M12 6c-3.31 0-6 2.69-6 6 0 2.22 1.21 4.15 3 5.19V18c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-.81c1.79-1.04 3-2.97 3-5.19 0-3.31-2.69-6-6-6zm2 11h-4v-1h4v1zm0-2h-4v-.81l-.6-.46C8.31 13.1 7.5 11.61 7.5 12c0-2.48 2.02-4.5 4.5-4.5s4.5 2.02 4.5 4.5c0 1.61-.81 3.1-1.9 3.73l-.6.46V15z"/>
            <path d="M10 20h4v1h-4z"/>
        </g>
    </svg>''',
    
    # Hand holding pencil (similar to Freepik reference)
    'pencil': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g fill="currentColor">
            <path d="M20.71 5.29l-2-2c-.39-.39-1.02-.39-1.41 0l-1.21 1.21 3.41 3.41 1.21-1.21c.39-.38.39-1.02 0-1.41zM3 18.5V22h3.5l10.09-10.09-3.41-3.41L3 18.5z"/>
            <path d="M14.5 10.5l-7 7c-.5.5-1.5.5-2 0l-.5-.5c-.5-.5-.5-1.5 0-2l7-7M7 18c0 .5.2 1 .5 1.3.4.4 1 .7 1.5.7h3c1 0 2-.3 2.8-.8.4-.3.8-.6 1.2-1.2" opacity="0.5"/>
            <path d="M8 19c0 .3.1.5.3.7l1 1c.2.2.4.3.7.3h2c.6 0 1.2-.2 1.7-.5.3-.2.5-.4.8-.8" opacity="0.3"/>
        </g>
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
    # Current lightbulb variations
    if 'M9 18c0 .55.45 1 1 1h4' in svg_content or 'M12 2v3M12 19v3' in svg_content or 'M12 6c-3.31' in svg_content:
        return 'lightbulb'
    # Current document
    elif 'M14 2H6c-1.1 0-1.99' in svg_content:
        return 'document'
    # Current pencil variations
    elif 'M3 17.25V21h3.75L17.81' in svg_content or 'M20.71 5.29l-2-2' in svg_content:
        return 'pencil'
    # Current checkbox
    elif 'M19 3H5c-1.11 0-2 .9-2 2v14' in svg_content:
        return 'checkbox'
    # Three stacked checkboxes (if any exist)
    elif 'rect x="3" y="3"' in svg_content:
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