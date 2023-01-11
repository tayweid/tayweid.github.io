window.addEventListener('DOMContentLoaded', () => {
    // Instead I want this to select only the first element not all in view
    
    // https://stackoverflow.com/questions/65954297/highlighting-item-in-table-of-contents-when-section-is-active-on-page-as-scrolli
    
    const observer = new IntersectionObserver(entries => {
      
    entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        if (entry.intersectionRatio > 0) {
            document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.add('active');
        } else {
            document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.remove('active');
        }
    });
    });

  // Track all sections that have an `id` applied
  document.querySelectorAll('section[id]').forEach((section) => {
    observer.observe(section);
  });
  
});