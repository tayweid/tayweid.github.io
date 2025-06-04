// Card highlighting functionality using intersection observers
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer options
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -30% 0px', // Only highlight when carousel is in center 40% of viewport
        threshold: 0
    };
    
    // Carousel card highlighting
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const carousel = entry.target.querySelector('.carousel');
            const cards = carousel.querySelectorAll('.carousel-card');
            const track = carousel.querySelector('.carousel-track');
            
            if (entry.isIntersecting) {
                // Enable active state for cards in this carousel
                const updateActiveCardOnScroll = () => {
                    cards.forEach((card, index) => {
                        const cardRect = card.getBoundingClientRect();
                        const trackRect = track.getBoundingClientRect();
                        const cardCenter = cardRect.left + (cardRect.width / 2) - trackRect.left;
                        const distance = Math.abs(cardCenter - (track.clientWidth / 2));
                        
                        if (distance < 50 && !card.classList.contains('placeholder')) {
                            card.classList.add('active');
                        } else {
                            card.classList.remove('active');
                        }
                    });
                };
                
                track.addEventListener('scroll', updateActiveCardOnScroll);
                updateActiveCardOnScroll(); // Initial check
                
                // Store the handler for cleanup
                track._scrollHandler = updateActiveCardOnScroll;
            } else {
                // Remove all active states when carousel is out of view
                cards.forEach(card => card.classList.remove('active'));
                
                // Remove scroll listener
                if (track._scrollHandler) {
                    track.removeEventListener('scroll', track._scrollHandler);
                    delete track._scrollHandler;
                }
            }
        });
    }, observerOptions);
    
    // Observe all carousel containers
    const carouselContainers = document.querySelectorAll('.carousel-container');
    carouselContainers.forEach(container => {
        carouselObserver.observe(container);
    });
    
    // Observe MiniExam sections for standalone card highlighting
    // Handle both singular (#miniexam) and plural (#miniexams) IDs
    const miniexamSections = document.querySelectorAll('#miniexam, #miniexams');
    
    miniexamSections.forEach(section => {
        const standaloneCards = section.querySelectorAll('.standalone-card');
        
        if (standaloneCards.length > 0) {
            const standaloneObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Highlight all standalone cards in this section
                        standaloneCards.forEach(card => {
                            card.classList.add('active');
                        });
                    } else {
                        // Remove highlight from all standalone cards in this section
                        standaloneCards.forEach(card => {
                            card.classList.remove('active');
                        });
                    }
                });
            }, observerOptions);
            
            standaloneObserver.observe(section);
        }
    });
});