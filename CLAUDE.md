# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for economics course materials hosted on GitHub Pages. It contains two main economics courses (econ-0100 and econ-0150) with a unified asset architecture that was recently refactored from separate course systems.

## Architecture

### Shared Asset System
The site uses a **shared asset architecture** located in `/course-assets/`:
- **CSS**: Modular CSS with 9 separate files imported through `main.css`
- **JavaScript**: Unified `main.js` with modular structure (EconApp object)
- **Both courses reference**: `../course-assets/styles/main.css` and `../course-assets/scripts/main.js`

### Course Structure
- `econ-0100/`: Microeconomics course (Parts A-F)
- `econ-0150/`: Economic Data Analysis course (Parts 1-6)
- Both courses use the same HTML structure but with course-specific CSS classes

### Course-Specific Styling
Each course has a wrapper class for customizations:
- `<div class="wrapper course-econ-0100">` for microeconomics
- `<div class="wrapper course-econ-0150">` for data analysis

Key difference: econ-0100 has 150px left sidebar, econ-0150 has 200px left sidebar (defined in `layout.css`).

## CSS Architecture

The modular CSS system in `/course-assets/styles/`:
- `main.css` - Import hub for all modules
- `variables.css` - CSS custom properties and color scheme
- `layout.css` - Three-column flexbox layout + course-specific overrides
- `navigation.css` - Left/right navigation styling
- `typography.css` - Font styles and text hierarchy
- `buttons.css` - Button styles and content boxes
- `carousel.css` - Interactive carousel components
- `video.css` - Video container styling
- `responsive.css` - Mobile breakpoints and adaptations

## JavaScript Architecture

Single unified script (`main.js`) with modular organization:
```javascript
const EconApp = {
    carousel: { /* Carousel functionality */ },
    navigation: { /* Scroll handling */ },
    highlights: { /* Intersection observers */ },
    downloads: { /* Download handling */ },
    init() { /* Initialize all modules */ }
};
```

## File Editing Guidelines

### Adding Content
- **Download links**: Use direct HTML links in card structure, not JavaScript mappings
- **New courses**: Add course-specific CSS class to wrapper div and define overrides in `layout.css`
- **Styling changes**: Edit the appropriate modular CSS file rather than adding inline styles

### Course Pages
Each course page (part-a.html, part-1.html, etc.) follows this structure:
1. HTML head with optimized font loading and shared CSS
2. Three-column layout (left nav, content, right nav) 
3. Content sections with carousel containers
4. Unified JavaScript at bottom

### Asset References
All HTML files reference shared assets:
- CSS: `<link rel="stylesheet" href="../course-assets/styles/main.css">`
- JS: `<script src="../course-assets/scripts/main.js"></script>`

## Key Implementation Details

### Carousel System
- Indicator tabs below carousels for navigation
- Cards use scroll-snap for smooth navigation
- JavaScript handles tab synchronization and smooth scrolling

### Download System  
- Direct HTML links in card content (no JavaScript mapping needed)
- Example: `<a href="file.pdf" class="download-link"><i class="fa fa-file-pdf-o"></i> Download</a>`

### Performance Optimizations
- Combined Google Fonts request instead of multiple
- No jQuery dependency (vanilla JavaScript)
- Modular CSS reduces redundancy across courses

### Responsive Design
- Mobile-first approach with desktop enhancements
- Sidebar navigation hidden on mobile
- Carousel touch-friendly on mobile devices