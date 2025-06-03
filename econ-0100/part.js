// Scroll to top on page load (disabled on mobile to prevent glitches)
document.addEventListener('DOMContentLoaded', function() {
    // Only scroll to top on desktop to avoid mobile scrolling issues
    if (window.innerWidth > 1000) {
        window.scrollTo(0, 0);
    }
});

// Scroll tracking for right sidebar only
window.addEventListener('scroll', function() {
    const scrollTop = document.documentElement.scrollTop;
    const anchors = document.querySelectorAll('div[id]');
    
    anchors.forEach(anchor => {
        const anchorTop = anchor.offsetTop;
        const anchorHeight = anchor.offsetHeight;
        
        if (scrollTop > anchorTop - 100 && scrollTop < anchorTop + anchorHeight - 100) {
            // Remove active from right sidebar links only
            document.querySelectorAll('.right_div nav a').forEach(link => link.classList.remove('active'));
            // Add active to current section link in right sidebar
            const navLink = document.querySelector(`.right_div nav a[href="#${anchor.id}"]`);
            if (navLink) navLink.classList.add('active');
        }
    });
});
