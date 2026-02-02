#!/usr/bin/env python3
"""
Script to update URLs in Jupyter notebooks.
Replaces 'projects/replication/replications' with 'projects/replications'
"""

import json
import os
from pathlib import Path

def update_notebook(filepath):
    """
    Update a single notebook, replacing the old URL pattern with the new one.
    Returns True if any changes were made, False otherwise.
    """
    old_pattern = 'projects/replication/replications'
    new_pattern = 'projects/replications'

    with open(filepath, 'r', encoding='utf-8') as f:
        notebook = json.load(f)

    modified = False

    # Process each cell
    if 'cells' in notebook:
        for cell in notebook['cells']:
            if 'source' in cell:
                # source can be a list of strings or a single string
                if isinstance(cell['source'], list):
                    new_source = []
                    for line in cell['source']:
                        if old_pattern in line:
                            new_source.append(line.replace(old_pattern, new_pattern))
                            modified = True
                        else:
                            new_source.append(line)
                    cell['source'] = new_source
                elif isinstance(cell['source'], str):
                    if old_pattern in cell['source']:
                        cell['source'] = cell['source'].replace(old_pattern, new_pattern)
                        modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(notebook, f, indent=1, ensure_ascii=False)
            f.write('\n')  # Add trailing newline

    return modified

def main():
    # Base directory for notebooks
    base_dir = Path('/Users/taylorjweidman/Library/CloudStorage/GoogleDrive-plusdirt@gmail.com/Other computers/Macbook Air/PROJECTS/tayweid.github.io/econ-0150/projects/replications')

    # Verify the directory exists
    if not base_dir.exists():
        print(f"Error: Directory does not exist: {base_dir}")
        return

    # Find all .ipynb files
    notebooks = list(base_dir.rglob('*.ipynb'))

    print(f"Found {len(notebooks)} notebook files")

    updated_count = 0
    updated_files = []

    for notebook_path in notebooks:
        try:
            if update_notebook(notebook_path):
                updated_count += 1
                updated_files.append(notebook_path.name)
                print(f"  Updated: {notebook_path.relative_to(base_dir)}")
        except Exception as e:
            print(f"  Error processing {notebook_path.name}: {e}")

    print(f"\nSummary:")
    print(f"  Total notebooks found: {len(notebooks)}")
    print(f"  Notebooks updated: {updated_count}")
    print(f"  Notebooks unchanged: {len(notebooks) - updated_count}")

if __name__ == '__main__':
    main()
