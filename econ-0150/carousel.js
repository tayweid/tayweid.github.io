// Simplified Carousel Implementation
// Removes auto-centering, intersection observers, and complex calculations

document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        const container = carousel.closest('.carousel-container');
        const track = carousel.querySelector('.carousel-track');
        const leftArrow = carousel.querySelector('.carousel-arrow-left');
        const rightArrow = carousel.querySelector('.carousel-arrow-right');
        const cards = carousel.querySelectorAll('.carousel-card');
        
        // Indicator functionality
        const indicator = container.querySelector('.carousel-indicator');
        if (indicator) {
            const indicatorTabs = indicator.querySelectorAll('.indicator-tab');
            const indicatorSlider = indicator.querySelector('.indicator-slider');
            
            // Simple slider position update
            const updateSliderPosition = (index) => {
                if (indicatorTabs[index]) {
                    const tab = indicatorTabs[index];
                    const indicatorTrack = indicator.querySelector('.indicator-track');
                    const trackPaddingLeft = 4; // From CSS padding
                    
                    const tabLeft = tab.offsetLeft;
                    const tabWidth = tab.offsetWidth;
                    
                    indicatorSlider.style.left = `${trackPaddingLeft}px`;
                    indicatorSlider.style.transform = `translateX(${tabLeft - 2}px)`;
                    indicatorSlider.style.width = `${tabWidth - 2}px`;
                    
                    // Update active states
                    indicatorTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                }
            };
            
            // Tab click handlers
            let isClickScrolling = false;
            indicatorTabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    if (cards[index]) {
                        isClickScrolling = true;
                        // Don't update slider position immediately - let scroll event handle it
                        cards[index].scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'center'
                        });
                        setTimeout(() => { isClickScrolling = false; }, 800);
                    }
                });
            });
            
            // Simple scroll tracking for indicator with debounce
            let scrollTimeout;
            track.addEventListener('scroll', () => {
                if (isClickScrolling) return;
                
                // Clear previous timeout
                clearTimeout(scrollTimeout);
                
                // Debounce to reduce jitter
                scrollTimeout = setTimeout(() => {
                    // Find closest card to center
                    const trackCenter = track.scrollLeft + (track.clientWidth / 2);
                    let closestIndex = 0;
                    let closestDistance = Infinity;
                    
                    cards.forEach((card, index) => {
                        const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
                        const distance = Math.abs(cardCenter - trackCenter);
                        
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestIndex = index;
                        }
                    });
                    
                    updateSliderPosition(closestIndex);
                }, 50);
            });
            
            // Initialize first tab as active and center first card
            const initializeSlider = () => {
                updateSliderPosition(0);
                // Center the first card
                cards[0].scrollIntoView({
                    behavior: 'auto',
                    block: 'nearest',
                    inline: 'center'
                });
            };
            setTimeout(initializeSlider, 50);
            
            // On resize, maintain the current active card's position
            window.addEventListener('resize', () => {
                setTimeout(() => {
                    const activeTab = indicator.querySelector('.indicator-tab.active');
                    if (activeTab) {
                        const activeIndex = Array.from(indicatorTabs).indexOf(activeTab);
                        updateSliderPosition(activeIndex);
                        
                        // Scroll the carousel track to center the active card
                        const targetCard = cards[activeIndex];
                        const cardLeft = targetCard.offsetLeft;
                        const cardWidth = targetCard.offsetWidth;
                        const trackWidth = track.clientWidth;
                        const targetScrollLeft = cardLeft - (trackWidth / 2) + (cardWidth / 2);
                        
                        track.scrollTo({
                            left: targetScrollLeft,
                            behavior: 'auto'
                        });
                    }
                }, 100);
            });
        }
        
        // Simple one-card-at-a-time navigation
        leftArrow.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth + 40; // card width + gap
            track.scrollBy({
                left: -cardWidth,
                behavior: 'smooth'
            });
        });
        
        rightArrow.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth + 40; // card width + gap
            track.scrollBy({
                left: cardWidth,
                behavior: 'smooth'
            });
        });
        
        // Update arrow visibility
        const updateArrows = () => {
            const isAtStart = track.scrollLeft <= 10;
            const isAtEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 10;
            
            leftArrow.style.opacity = isAtStart ? '0.5' : '1';
            rightArrow.style.opacity = isAtEnd ? '0.5' : '1';
        };
        
        track.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        updateArrows();
        
        // Card click functionality for videos/PDFs
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on a link
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                    return;
                }
                
                const videoId = card.getAttribute('data-video-id');
                if (videoId) {
                    if (videoId.includes('.pdf') || videoId.includes('/')) {
                        // It's a file path - open directly
                        window.open(videoId, '_blank');
                    } else {
                        // It's a YouTube video ID - open YouTube
                        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                    }
                }
            });
        });
    });
});