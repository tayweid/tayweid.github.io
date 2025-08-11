#!/usr/bin/env python3
"""
Batch restructure homework directories to new format.
This script will:
1. Create data/ and i/ subdirectories
2. Move appropriate files to these directories
3. Create/update Jupyter notebooks with homework content
4. Fix image paths
"""

import os
import json
import shutil
import re

# Base directory
BASE_DIR = '/Users/taylorjweidman/PROJECTS/tayweid.github.io/econ-0150/hw'

def process_hw_directory(hw_name, actions):
    """Process a single homework directory with specified actions."""
    hw_path = os.path.join(BASE_DIR, hw_name)
    print(f"\n{'='*60}")
    print(f"Processing {hw_name}")
    print(f"{'='*60}")
    
    # Create subdirectories
    data_dir = os.path.join(hw_path, 'data')
    img_dir = os.path.join(hw_path, 'i')
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(img_dir, exist_ok=True)
    print(f"✓ Created data/ and i/ directories")
    
    # Move files
    for action in actions:
        if action['type'] == 'move':
            src = os.path.join(hw_path, action['file'])
            dst = os.path.join(hw_path, action['to'], action['file'])
            if os.path.exists(src) and not os.path.exists(dst):
                shutil.move(src, dst)
                print(f"✓ Moved {action['file']} to {action['to']}/")
        elif action['type'] == 'create_notebook':
            create_notebook_from_markdown(hw_path, action['md_file'], action['hw_num'])
    
    print(f"✓ Completed {hw_name}")

def create_notebook_from_markdown(hw_path, md_file, hw_num):
    """Create notebook from markdown file."""
    md_path = os.path.join(hw_path, md_file)
    if not os.path.exists(md_path):
        print(f"  ⚠ Markdown file {md_file} not found")
        return
    
    with open(md_path, 'r') as f:
        content = f.read()
    
    # Parse markdown content
    lines = content.split('\n')
    cells = []
    
    # Extract title and metadata
    title = ""
    due = ""
    instructions = ""
    
    for i, line in enumerate(lines):
        if line.startswith('## ECON'):
            title = line.replace('##', '#').strip()
        elif line.startswith('### Due:'):
            due = line.strip()
        elif 'Homework is designed' in line:
            # Find the full instructions paragraph
            j = i
            inst_lines = []
            while j < len(lines) and lines[j].strip():
                inst_lines.append(lines[j])
                j += 1
            instructions = '\n'.join(inst_lines)
            break
    
    # Create cells
    # Title cell
    if title:
        cells.append({
            "cell_type": "markdown",
            "metadata": {},
            "source": [title]
        })
    
    # Instructions cell
    if due or instructions:
        source = []
        if due:
            source.append(due)
            source.append("")
        if instructions:
            source.append(instructions)
        cells.append({
            "cell_type": "markdown",
            "metadata": {},
            "source": '\n'.join(source)
        })
    
    # Imports cell
    cells.append({
        "cell_type": "code",
        "metadata": {},
        "source": [
            "# Imports\n",
            "import pandas as pd\n",
            "import numpy as np\n",
            "import matplotlib.pyplot as plt\n",
            "import seaborn as sns\n",
            "%matplotlib inline"
        ],
        "outputs": [],
        "execution_count": None
    })
    
    # Data loading cell
    data_dir = os.path.join(hw_path, 'data')
    if os.path.exists(data_dir):
        csv_files = [f for f in os.listdir(data_dir) if f.endswith('.csv') and not f.startswith('.')]
        if csv_files:
            source = ["# Load Data\n"]
            for csv in sorted(csv_files):
                var_name = csv.replace('.csv', '').replace('-', '_').replace(' ', '_')
                source.append(f"{var_name} = pd.read_csv('data/{csv}')\n")
            cells.append({
                "cell_type": "code",
                "metadata": {},
                "source": source,
                "outputs": [],
                "execution_count": None
            })
    
    # Parse questions
    current_section = []
    in_question = False
    
    for line in lines:
        if line.startswith('#### '):
            # Save previous section if any
            if current_section and in_question:
                process_question_section(cells, current_section)
            # Start new question
            current_section = [line]
            in_question = True
        elif in_question:
            current_section.append(line)
    
    # Don't forget the last section
    if current_section and in_question:
        process_question_section(cells, current_section)
    
    # Save notebooks
    notebook = {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "codemirror_mode": {
                    "name": "ipython",
                    "version": 3
                },
                "file_extension": ".py",
                "mimetype": "text/x-python",
                "name": "python",
                "nbconvert_exporter": "python",
                "pygments_lexer": "ipython3",
                "version": "3.8.0"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 4
    }
    
    # Save regular notebook
    nb_path = os.path.join(hw_path, f"Homework_{hw_num}.ipynb")
    with open(nb_path, 'w') as f:
        json.dump(notebook, f, indent=1)
    print(f"✓ Created {os.path.basename(nb_path)}")
    
    # Save solutions notebook
    sols_path = os.path.join(hw_path, f"Homework_{hw_num}_sols.ipynb")
    with open(sols_path, 'w') as f:
        json.dump(notebook, f, indent=1)
    print(f"✓ Created {os.path.basename(sols_path)}")

def process_question_section(cells, section_lines):
    """Process a question section and add appropriate cells."""
    if not section_lines:
        return
    
    # Question title
    title = section_lines[0]
    cells.append({
        "cell_type": "markdown",
        "metadata": {},
        "source": [title]
    })
    
    # Process content
    content = '\n'.join(section_lines[1:]).strip()
    
    # Update image paths
    content = re.sub(r'!\[([^\]]*)\]\(([^/)]+\.png)\)', r'![\1](i/\2)', content)
    content = re.sub(r'<img\s+src="([^/"]+\.png)"', r'<img src="i/\1"', content)
    
    # Check for subquestions
    subq_pattern = r'^([a-z]\.)'
    parts = re.split(subq_pattern, content, flags=re.MULTILINE)
    
    if len(parts) > 1:
        # Add intro if exists
        if parts[0].strip():
            cells.append({
                "cell_type": "markdown",
                "metadata": {},
                "source": [parts[0].strip()]
            })
        
        # Add subquestions
        for i in range(1, len(parts), 2):
            if i+1 < len(parts):
                subq = f"{parts[i]} {parts[i+1].strip()}"
                cells.append({
                    "cell_type": "markdown",
                    "metadata": {},
                    "source": [subq]
                })
                
                # Add code cell if needed
                if any(kw in parts[i+1].lower() for kw in ['plot', 'create', 'code', 'calculate']):
                    cells.append({
                        "cell_type": "code",
                        "metadata": {},
                        "source": ["# "],
                        "outputs": [],
                        "execution_count": None
                    })
    else:
        # No subquestions
        if content:
            cells.append({
                "cell_type": "markdown",
                "metadata": {},
                "source": [content]
            })
            
            # Add code cell if needed
            if any(kw in content.lower() for kw in ['plot', 'create', 'code', 'calculate', 'visualization']):
                cells.append({
                    "cell_type": "code",
                    "metadata": {},
                    "source": ["# "],
                    "outputs": [],
                    "execution_count": None
                })

# Define all homework directories and their actions
HOMEWORK_CONFIGS = {
    'hw-1-0': {
        'actions': [
            {'type': 'move', 'file': 'ECON_0150_Survey.csv', 'to': 'data'},
            {'type': 'move', 'file': 'HW_1_0_Leisure.csv', 'to': 'data'},
            {'type': 'move', 'file': 'HW_1_0_Working.csv', 'to': 'data'},
            {'type': 'move', 'file': 'HW_1_0_Q1.png', 'to': 'i'},
            {'type': 'move', 'file': 'HW_1_0_Q2.png', 'to': 'i'},
            {'type': 'create_notebook', 'md_file': 'HW_1_0.md', 'hw_num': '1_0'},
        ]
    },
    'hw-1-1': {
        'actions': [
            {'type': 'move', 'file': 'ECON_0150_Survey.csv', 'to': 'data'},
            {'type': 'create_notebook', 'md_file': 'HW_1_1.md', 'hw_num': '1_1'},
        ]
    },
    'hw-1-2': {
        'actions': [
            {'type': 'move', 'file': 'ECON_0150_Survey.csv', 'to': 'data'},
            {'type': 'create_notebook', 'md_file': 'HW_1_2.md', 'hw_num': '1_2'},
        ]
    },
    'hw-1-3': {
        'actions': [
            {'type': 'create_notebook', 'md_file': 'HW_1_3.md', 'hw_num': '1_3'},
        ]
    },
    'hw-1-4': {
        'actions': [
            {'type': 'create_notebook', 'md_file': 'HW_1_4.md', 'hw_num': '1_4'},
        ]
    },
    'hw-1-5': {
        'actions': [
            {'type': 'move', 'file': 'HW_1_5_Amazon_Books.csv', 'to': 'data'},
            {'type': 'move', 'file': 'HW_1_5_Amazon_Books_raw.csv', 'to': 'data'},
            {'type': 'move', 'file': 'HW_1_5_Amazon_Books_sols.xlsx', 'to': 'data'},
            {'type': 'create_notebook', 'md_file': 'HW_1_5.md', 'hw_num': '1_5'},
        ]
    },
    'hw-1-6': {
        'actions': [
            {'type': 'move', 'file': 'HW_1_6_Marriage_Rates.csv', 'to': 'data'},
            {'type': 'move', 'file': 'HW_1_6_Marriage_Rates_sols.xlsx', 'to': 'data'},
            {'type': 'create_notebook', 'md_file': 'HW_1_6.md', 'hw_num': '1_6'},
        ]
    },
    'hw-1-7': {
        'actions': [
            {'type': 'move', 'file': 'HW_1_7_Marriage_Rates.csv', 'to': 'data'},
            {'type': 'create_notebook', 'md_file': 'HW_1_7.md', 'hw_num': '1_7'},
        ]
    },
}

def main():
    """Main function to process all homework directories."""
    print("Starting batch restructuring of homework directories...")
    
    for hw_name, config in HOMEWORK_CONFIGS.items():
        hw_path = os.path.join(BASE_DIR, hw_name)
        if os.path.exists(hw_path):
            process_hw_directory(hw_name, config['actions'])
        else:
            print(f"\n⚠ Skipping {hw_name} - directory not found")
    
    print("\n" + "="*60)
    print("Batch restructuring complete!")
    print("="*60)

if __name__ == "__main__":
    main()