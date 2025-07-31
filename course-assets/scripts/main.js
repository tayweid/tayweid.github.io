/* =============================================================================
   MAIN JAVASCRIPT - UNIFIED FUNCTIONALITY
   ============================================================================= */

const EconApp = {
    
    /* -------------------------------------------------------------------------
       CAROUSEL MODULE (from carousel.js)
       ------------------------------------------------------------------------- */
    carousel: {
        init() {
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
                    
                    // Simple active state update
                    const updateActiveIndicator = (index) => {
                        if (indicatorTabs[index]) {
                            // Update active states
                            indicatorTabs.forEach(t => t.classList.remove('active'));
                            indicatorTabs[index].classList.add('active');
                        }
                    };
                    
                    // Arrow click handlers
                    if (leftArrow) {
                        leftArrow.addEventListener('click', () => {
                            track.scrollBy({ left: -400, behavior: 'smooth' });
                        });
                    }
                    
                    if (rightArrow) {
                        rightArrow.addEventListener('click', () => {
                            track.scrollBy({ left: 400, behavior: 'smooth' });
                        });
                    }
                    
                    // Indicator click handlers
                    indicatorTabs.forEach((tab, index) => {
                        tab.addEventListener('click', () => {
                            if (cards[index]) {
                                const targetScrollLeft = Math.max(0, 
                                    cards[index].offsetLeft - (track.clientWidth / 2) + (cards[index].offsetWidth / 2)
                                );
                                
                                track.scrollTo({
                                    left: Math.max(0, targetScrollLeft),
                                    behavior: 'smooth'
                                });
                                
                                updateActiveIndicator(index);
                            }
                        });
                    });
                    
                    // Scroll event listener to sync indicator with manual scrolling
                    track.addEventListener('scroll', () => {
                        // Find which card is most visible in the center
                        const trackRect = track.getBoundingClientRect();
                        const trackCenter = trackRect.left + trackRect.width / 2;
                        
                        let closestIndex = 0;
                        let closestDistance = Infinity;
                        
                        cards.forEach((card, index) => {
                            const cardRect = card.getBoundingClientRect();
                            const cardCenter = cardRect.left + cardRect.width / 2;
                            const distance = Math.abs(cardCenter - trackCenter);
                            
                            if (distance < closestDistance) {
                                closestDistance = distance;
                                closestIndex = index;
                            }
                        });
                        
                        // Update active indicator
                        updateActiveIndicator(closestIndex);
                    });
                    
                    // Initialize first tab with slight delay to ensure layout is ready
                    setTimeout(() => {
                        updateActiveIndicator(0);
                    }, 50);
                }
                
                // Auto-setup video thumbnails and click handlers
                cards.forEach(card => {
                    const videoId = card.getAttribute('data-video-id');
                    const cardVideo = card.querySelector('.card-video');
                    const img = cardVideo?.querySelector('img');
                    
                    // Add error handler to ALL images in video cards
                    if (img) {
                        img.onerror = function() {
                            this.classList.add('placeholder-bg');
                        };
                    }
                    
                    if (videoId && cardVideo) {
                        // Check if it's a YouTube video ID (11 characters, alphanumeric + hyphens/underscores)
                        const isYouTubeId = /^[a-zA-Z0-9_-]{11}$/.test(videoId);
                        
                        if (isYouTubeId) {
                            // Auto-load YouTube thumbnail
                            if (img) {
                                img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                                img.classList.remove('placeholder-bg');
                                img.alt = 'Video thumbnail';
                            }
                            
                            // Add real video play button if it doesn't exist
                            if (!cardVideo.querySelector('.play-button')) {
                                const playButton = document.createElement('div');
                                playButton.className = 'play-button';
                                playButton.textContent = '▶';
                                cardVideo.appendChild(playButton);
                            }
                            
                            // Add click handler to open YouTube video
                            cardVideo.style.cursor = 'pointer';
                            cardVideo.addEventListener('click', () => {
                                window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                            });
                        }
                    }
                });
            });
        }
    },

    /* -------------------------------------------------------------------------
       NAVIGATION MODULE (from part.js)
       ------------------------------------------------------------------------- */
    navigation: {
        init() {
            // Force scroll to top on page load
            window.scrollTo(0, 0);
            
            // Active navigation highlighting on scroll
            window.addEventListener('scroll', () => {
                const scrollTop = document.documentElement.scrollTop;
                const anchors = document.querySelectorAll('body div[id]');
                
                anchors.forEach(anchor => {
                    const anchorTop = anchor.offsetTop;
                    const anchorHeight = anchor.offsetHeight;
                    
                    if (scrollTop > anchorTop - 100 && scrollTop < anchorTop + anchorHeight - 100) {
                        document.querySelectorAll(`nav a[href="#${anchor.id}"]`).forEach(link => {
                            link.classList.add('active');
                        });
                    } else {
                        document.querySelectorAll(`nav a[href="#${anchor.id}"]`).forEach(link => {
                            link.classList.remove('active');
                        });
                    }
                });
            });
        }
    },

    /* -------------------------------------------------------------------------
       HIGHLIGHTS MODULE (from highlights.js)
       ------------------------------------------------------------------------- */
    highlights: {
        init() {
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
            const miniexamSections = document.querySelectorAll('#miniexam, #miniexams');
            
            miniexamSections.forEach(section => {
                const standaloneCards = section.querySelectorAll('.standalone-card');
                
                if (standaloneCards.length > 0) {
                    const standaloneObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                standaloneCards.forEach(card => {
                                    card.classList.add('active');
                                });
                            } else {
                                standaloneCards.forEach(card => {
                                    card.classList.remove('active');
                                });
                            }
                        });
                    }, observerOptions);
                    
                    standaloneObserver.observe(section);
                }
            });
        }
    },

    /* -------------------------------------------------------------------------
       DOWNLOADS MODULE (simplified from downloads.js)
       ------------------------------------------------------------------------- */
    downloads: {
        init() {
            // Simple download handler for direct links in HTML
            document.addEventListener('click', (e) => {
                // Handle download links with data-download attribute
                if (e.target.hasAttribute('data-download')) {
                    e.preventDefault();
                    const url = e.target.getAttribute('data-download');
                    window.open(url, '_blank');
                }
                
                // Handle video links
                if (e.target.closest('.carousel-card[data-video-id]')) {
                    const card = e.target.closest('.carousel-card[data-video-id]');
                    const videoId = card.getAttribute('data-video-id');
                    
                    if (videoId && !e.target.closest('.card-downloads')) {
                        if (videoId.startsWith('http')) {
                            window.open(videoId, '_blank');
                        } else {
                            window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                        }
                    }
                }
            });
        }
    },

    /* -------------------------------------------------------------------------
       MAIN INITIALIZATION
       ------------------------------------------------------------------------- */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.carousel.init();
            this.navigation.init();
            this.highlights.init();
            this.downloads.init();
        });
    }
};

// Initialize the application
EconApp.init();