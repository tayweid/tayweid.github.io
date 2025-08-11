import os
import shutil

# Process loose files in hw directory
hw_dir = '/Users/taylorjweidman/PROJECTS/tayweid.github.io/econ-0150/hw'

# Create directories for HW 10, 11, 12
for num in ['10', '11', '12']:
    dir_path = os.path.join(hw_dir, f'hw-{num}')
    os.makedirs(dir_path, exist_ok=True)
    os.makedirs(os.path.join(dir_path, 'data'), exist_ok=True)
    os.makedirs(os.path.join(dir_path, 'i'), exist_ok=True)
    
    # Move markdown file if exists
    md_file = f'HW_{num}.md'
    if os.path.exists(os.path.join(hw_dir, md_file)):
        shutil.move(os.path.join(hw_dir, md_file), os.path.join(dir_path, md_file))
        print(f"Moved {md_file} to hw-{num}/")

# Move data files to appropriate locations
file_mappings = {
    'HW05_06_Q1.csv': 'hw-5-6/data',
    'HW05_06_Q4.csv': 'hw-5-6/data', 
    'HW5_Q5.csv': 'hw-5-5/data',
    'HW6_Q5.xlsx': 'hw-6-5/data',
    'HW7_Q2.csv': 'hw-7-2/data'
}

# Create directories for hw-5-6, hw-5-5, hw-6-5, hw-7-2 if needed
for dirname in ['hw-5-6', 'hw-5-5', 'hw-6-5', 'hw-7-2']:
    full_path = os.path.join(hw_dir, dirname)
    os.makedirs(full_path, exist_ok=True)
    os.makedirs(os.path.join(full_path, 'data'), exist_ok=True)
    os.makedirs(os.path.join(full_path, 'i'), exist_ok=True)

# Move files
for file, dest in file_mappings.items():
    src = os.path.join(hw_dir, file)
    if os.path.exists(src):
        dest_dir = os.path.join(hw_dir, dest)
        os.makedirs(dest_dir, exist_ok=True)
        shutil.move(src, os.path.join(dest_dir, file))
        print(f"Moved {file} to {dest}/")

print("Done processing loose files!")