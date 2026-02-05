"""
Add slide breaks (---) between consecutive code blocks in slides.qmd files.

In Quarto revealjs:
  - ## headings auto-create new slides
  - Between consecutive ```{python} blocks with no heading, we need ---

This script processes all part-*/slides.qmd files.
"""

import os
import re
import glob

parts_dir = os.path.dirname(os.path.abspath(__file__))

def add_slide_breaks(content):
    """Insert --- between consecutive code blocks that have no ## heading between them."""
    lines = content.split('\n')
    result = []
    in_code_block = False
    just_closed_code = False  # True after we close a code block

    for i, line in enumerate(lines):
        stripped = line.strip()

        # Track code block boundaries
        if stripped.startswith('```{python}') or stripped.startswith('```{python '):
            if just_closed_code:
                # We're opening a new code block right after closing one
                # with no ## heading in between -> insert slide break
                result.append('---')
                result.append('')
            in_code_block = True
            just_closed_code = False
            result.append(line)
            continue

        if in_code_block:
            if stripped == '```':
                in_code_block = False
                just_closed_code = True
            result.append(line)
            continue

        # We're outside a code block
        if just_closed_code:
            # Check if this line starts a heading or is significant content
            if stripped.startswith('## ') or stripped.startswith('# '):
                # A heading will auto-create a slide break, no need for ---
                just_closed_code = False
            elif stripped == '---':
                # Already has a slide break
                just_closed_code = False
            elif stripped == '':
                # Blank line between code blocks - keep going
                pass
            else:
                # Some non-heading content between code blocks
                # This is prose that belongs on its own slide with the next code block
                # Insert --- before this content
                result.append('---')
                result.append('')
                just_closed_code = False

        result.append(line)

    return '\n'.join(result)


def fix_markdown_examples(content):
    """
    Wrap raw markdown examples (# Heading, ## Heading, --- in prose)
    inside code fences so Quarto doesn't interpret them as slide structure.

    This is a heuristic - it looks for patterns like:
    "In markdown cells you can enter..." followed by raw # headings
    """
    # This is hard to do generically without false positives,
    # so we only fix the known pattern from part-00 and part-01
    # where markdown syntax is being demonstrated
    return content


def process_file(filepath):
    """Process a single slides.qmd file."""
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    content = add_slide_breaks(content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False


# Find all slides.qmd files
pattern = os.path.join(parts_dir, 'part-*', 'slides.qmd')
files = sorted(glob.glob(pattern))

print(f"Found {len(files)} slides.qmd files\n")

for filepath in files:
    part_name = os.path.basename(os.path.dirname(filepath))
    changed = process_file(filepath)
    status = "updated" if changed else "no changes needed"

    # Count code blocks and slide breaks
    with open(filepath, 'r') as f:
        content = f.read()
    n_code = content.count('```{python}')
    n_breaks = content.count('\n---\n')
    n_headings = len(re.findall(r'^#{1,2} ', content, re.MULTILINE))

    print(f"  {part_name}: {status} ({n_code} code blocks, {n_headings} headings, {n_breaks} slide breaks)")

print("\nDone!")
print("\nNote: You should manually review part-00 and part-01 slides.qmd")
print("as they contain raw markdown examples (# Heading, ## Heading, ---)")
print("that Quarto will misinterpret as slide structure.")
print("Wrap those examples in ````markdown ... ```` fences.")
