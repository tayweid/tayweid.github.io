import os
import shutil
import json
import re

def create_subdirs(hw_dir):
    """Create data and i subdirectories if they don't exist."""
    data_dir = os.path.join(hw_dir, 'data')
    img_dir = os.path.join(hw_dir, 'i')
    
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(img_dir, exist_ok=True)
    
    return data_dir, img_dir

def move_files_to_subdirs(hw_dir):
    """Move data and image files to appropriate subdirectories."""
    data_dir, img_dir = create_subdirs(hw_dir)
    
    # Move data files
    data_extensions = ['.csv', '.xlsx', '.xpt', '.txt']
    img_extensions = ['.png', '.jpg', '.jpeg', '.gif']
    
    moved_files = {'data': [], 'images': []}
    
    for file in os.listdir(hw_dir):
        if file == 'Icon' or file.startswith('.'):
            continue
            
        file_path = os.path.join(hw_dir, file)
        if os.path.isfile(file_path):
            # Check for data files
            if any(file.lower().endswith(ext) for ext in data_extensions):
                # Skip if it's a data source description file
                if 'Sources' not in file:
                    new_path = os.path.join(data_dir, file)
                    if not os.path.exists(new_path):
                        shutil.move(file_path, new_path)
                        moved_files['data'].append(file)
                        print(f"  Moved {file} to data/")
            
            # Check for image files
            elif any(file.lower().endswith(ext) for ext in img_extensions):
                new_path = os.path.join(img_dir, file)
                if not os.path.exists(new_path):
                    shutil.move(file_path, new_path)
                    moved_files['images'].append(file)
                    print(f"  Moved {file} to i/")
    
    return moved_files

def parse_markdown_file(filepath):
    """Parse markdown file and extract components."""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except:
        return None
    
    # Extract title
    title_match = re.search(r'^##\s+(.+)$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else "Homework"
    
    # Extract due date line
    due_match = re.search(r'^###\s+Due:.*$', content, re.MULTILINE)
    due_line = due_match.group(0) if due_match else ""
    
    # Extract instructions paragraph
    instructions_match = re.search(r'Homework is designed.*?(?:Gradescope|submission)\.', content, re.DOTALL | re.IGNORECASE)
    instructions = instructions_match.group(0) if instructions_match else ""
    
    # Split by questions
    questions = []
    question_pattern = r'^####\s+(.+?)$'
    parts = re.split(question_pattern, content, flags=re.MULTILINE)
    
    # Skip the header part and process questions
    for i in range(1, len(parts), 2):
        if i+1 < len(parts):
            q_title = parts[i]
            q_content = parts[i+1].strip()
            questions.append((q_title, q_content))
    
    return {
        'title': title,
        'due_line': due_line,
        'instructions': instructions,
        'questions': questions,
        'full_content': content
    }

def update_image_paths_in_content(content):
    """Update image paths to use i/ subdirectory."""
    # Update markdown image syntax
    content = re.sub(r'!\[([^\]]*)\]\(([^/)]+\.(?:png|jpg|jpeg|gif))\)', r'![\1](i/\2)', content)
    # Update HTML img tags
    content = re.sub(r'<img\s+src="([^/"]+\.(?:png|jpg|jpeg|gif))"', r'<img src="i/\1"', content)
    return content

def create_notebook_cells(parsed_data, hw_dir):
    """Create notebook cells from parsed markdown data."""
    cells = []
    
    # Title cell
    cells.append({
        "cell_type": "markdown",
        "metadata": {},
        "source": [f"# {parsed_data['title']}"]
    })
    
    # Instructions cell
    if parsed_data['due_line'] or parsed_data['instructions']:
        source = []
        if parsed_data['due_line']:
            source.append(parsed_data['due_line'])
            source.append("")
        if parsed_data['instructions']:
            source.append(parsed_data['instructions'])
        cells.append({
            "cell_type": "markdown",
            "metadata": {},
            "source": update_image_paths_in_content("\n".join(source))
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
    
    # Data loading cell (if data files exist)
    data_dir = os.path.join(hw_dir, 'data')
    if os.path.exists(data_dir):
        data_files = [f for f in os.listdir(data_dir) if f.endswith('.csv') and 'Icon' not in f]
        if data_files:
            source = ["# Load Data\n"]
            for df in sorted(data_files):
                var_name = df.replace('.csv', '').replace('-', '_').replace(' ', '_')
                source.append(f"{var_name} = pd.read_csv('data/{df}')\n")
            
            cells.append({
                "cell_type": "code",
                "metadata": {},
                "source": source,
                "outputs": [],
                "execution_count": None
            })
    
    # Process questions
    for q_title, q_content in parsed_data['questions']:
        # Question title cell
        cells.append({
            "cell_type": "markdown",
            "metadata": {},
            "source": [f"#### {q_title}"]
        })
        
        # Update image paths in question content
        q_content = update_image_paths_in_content(q_content)
        
        # Split content by subquestions (a), b), etc.)
        subq_pattern = r'^([a-z]\))'
        parts = re.split(subq_pattern, q_content, flags=re.MULTILINE)
        
        if len(parts) > 1:
            # Has subquestions
            if parts[0].strip():
                cells.append({
                    "cell_type": "markdown", 
                    "metadata": {},
                    "source": [parts[0].strip()]
                })
            
            # Process each subquestion
            for i in range(1, len(parts), 2):
                if i+1 < len(parts):
                    subq_label = parts[i]
                    subq_content = parts[i+1].strip()
                    
                    cells.append({
                        "cell_type": "markdown",
                        "metadata": {},
                        "source": [f"{subq_label} {subq_content}"]
                    })
                    
                    # Add code cell if question seems to require code
                    if any(keyword in subq_content.lower() for keyword in 
                          ['plot', 'create', 'generate', 'calculate', 'compute', 'python', 'code', 'visualization']):
                        cells.append({
                            "cell_type": "code",
                            "metadata": {},
                            "source": ["# "],
                            "outputs": [],
                            "execution_count": None
                        })
        else:
            # No subquestions
            if q_content.strip():
                cells.append({
                    "cell_type": "markdown",
                    "metadata": {},
                    "source": [q_content.strip()]
                })
                
                # Add code cell if needed
                if any(keyword in q_content.lower() for keyword in 
                      ['plot', 'create', 'generate', 'calculate', 'compute', 'python', 'code', 'visualization']):
                    cells.append({
                        "cell_type": "code",
                        "metadata": {},
                        "source": ["# "],
                        "outputs": [],
                        "execution_count": None
                    })
    
    return cells

def create_notebook(cells, output_path):
    """Create a Jupyter notebook with the given cells."""
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
    
    with open(output_path, 'w') as f:
        json.dump(notebook, f, indent=1)

def process_homework_directory(hw_dir):
    """Process a single homework directory."""
    hw_name = os.path.basename(hw_dir)
    print(f"\nProcessing {hw_name}...")
    
    # Step 1: Move files to subdirectories
    moved_files = move_files_to_subdirs(hw_dir)
    
    # Step 2: Find and parse markdown file
    md_files = [f for f in os.listdir(hw_dir) if f.endswith('.md') and 'answer_key' not in f and 'Sources' not in f]
    
    if md_files:
        md_file = md_files[0]
        md_path = os.path.join(hw_dir, md_file)
        print(f"  Parsing {md_file}")
        
        parsed = parse_markdown_file(md_path)
        if parsed:
            # Create notebook cells
            cells = create_notebook_cells(parsed, hw_dir)
            
            # Create notebook names based on hw directory name
            hw_num = hw_name.replace('hw-', '').replace('-', '_')
            
            # Create regular notebook
            regular_nb = os.path.join(hw_dir, f"Homework_{hw_num}.ipynb")
            create_notebook(cells, regular_nb)
            print(f"  Created {os.path.basename(regular_nb)}")
            
            # Create solutions notebook if it doesn't exist
            sols_nb = os.path.join(hw_dir, f"Homework_{hw_num}_sols.ipynb")
            if not os.path.exists(sols_nb):
                create_notebook(cells, sols_nb)
                print(f"  Created {os.path.basename(sols_nb)}")
    
    # Step 3: Rename incorrectly named notebooks
    for file in os.listdir(hw_dir):
        if file.endswith('.ipynb') and 'hw_' in file:
            # Extract the homework number
            match = re.search(r'hw_(\d+_\d+)', file)
            if match:
                hw_num = match.group(1)
                if 'sols' in file:
                    new_name = f"Homework_{hw_num}_sols.ipynb"
                else:
                    new_name = f"Homework_{hw_num}.ipynb"
                
                old_path = os.path.join(hw_dir, file)
                new_path = os.path.join(hw_dir, new_name)
                
                if not os.path.exists(new_path):
                    os.rename(old_path, new_path)
                    print(f"  Renamed {file} to {new_name}")

def main():
    """Main function to process all homework directories."""
    hw_base = '/Users/taylorjweidman/PROJECTS/tayweid.github.io/econ-0150/hw'
    
    # List of homework directories to process
    hw_dirs = [
        'hw-1-0', 'hw-1-1', 'hw-1-2', 'hw-1-3', 'hw-1-4', 'hw-1-5', 'hw-1-6', 'hw-1-7',
        'hw-3-1', 'hw-3-2', 'hw-3-3', 'hw-3-4',
        'hw-5-1', 'hw-5-2', 'hw-5-3', 'hw-5-4'
    ]
    
    for hw_dir in hw_dirs:
        full_path = os.path.join(hw_base, hw_dir)
        if os.path.exists(full_path):
            process_homework_directory(full_path)
        else:
            print(f"\nSkipping {hw_dir} - directory not found")
    
    print("\nRestructuring complete!")

if __name__ == "__main__":
    main()