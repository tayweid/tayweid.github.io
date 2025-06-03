// Scroll to top on page load (disabled on mobile to prevent glitches)
document.addEventListener('DOMContentLoaded', function() {
    // Only scroll to top on desktop to avoid mobile scrolling issues
    if (window.innerWidth > 1000) {
        window.scrollTo(0, 0);
    }
});

// Simple scroll tracking for navigation highlighting
window.addEventListener('scroll', function() {
    const scrollTop = document.documentElement.scrollTop;
    const anchors = document.querySelectorAll('div[id]');
    
    anchors.forEach(anchor => {
        const anchorTop = anchor.offsetTop;
        const anchorHeight = anchor.offsetHeight;
        
        if (scrollTop > anchorTop - 100 && scrollTop < anchorTop + anchorHeight - 100) {
            // Remove active from all nav links
            document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
            // Add active to current section link
            const navLink = document.querySelector(`nav a[href="#${anchor.id}"]`);
            if (navLink) navLink.classList.add('active');
        }
    });
});