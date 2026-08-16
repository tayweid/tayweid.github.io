/* =============================================================================
   MAIN JAVASCRIPT - UNIFIED FUNCTIONALITY
   ============================================================================= */

const EconApp = {
    
    /* -------------------------------------------------------------------------
       CAROUSEL MODULE (from carousel.js)
       ------------------------------------------------------------------------- */
    carousel: {
        getCardMeta(card) {
            const titleElement = card.querySelector('.card-title');
            const titleForLabel = titleElement?.cloneNode(true);
            titleForLabel?.querySelectorAll('a').forEach(link => link.remove());
            const fullTitle = titleForLabel?.textContent
                .replace(/\s+/g, ' ')
                .trim() || 'Resource';
            const normalizedTitle = fullTitle.toLowerCase();

            let indicatorClass = 'resource-indicator';
            let label = 'Resource';
            let icon = 'fa-circle-o';

            if (card.classList.contains('livestream-card')) {
                indicatorClass = 'livestream-indicator';
                label = 'Live';
                icon = 'fa-video-camera';
            } else if (card.classList.contains('homework-card')) {
                indicatorClass = 'homework-indicator';
                label = 'Submit';
                icon = 'fa-check-square-o';
            } else if (card.classList.contains('exercise-card')) {
                indicatorClass = 'exercise-indicator';
                if (normalizedTitle.startsWith('vignette')) {
                    label = 'Practice';
                    icon = 'fa-pencil-square-o';
                } else if (normalizedTitle.startsWith('demo')) {
                    label = 'Demo';
                    icon = 'fa-line-chart';
                } else {
                    label = 'Exercise';
                    icon = 'fa-pencil';
                }
            } else if (card.classList.contains('concept-card')) {
                indicatorClass = 'concept-indicator';
                if (normalizedTitle.startsWith('episode')) {
                    label = 'Episode';
                    icon = 'fa-play-circle-o';
                } else if (normalizedTitle.startsWith('chapter') || normalizedTitle.startsWith('reading')) {
                    label = 'Reading';
                    icon = 'fa-book';
                } else if (normalizedTitle.startsWith('lecture')) {
                    label = 'Lecture';
                    icon = 'fa-file-text-o';
                } else if (card.dataset.videoId) {
                    label = 'Video';
                    icon = 'fa-play-circle-o';
                } else {
                    label = 'Concept';
                    icon = 'fa-lightbulb-o';
                }
            }

            return { fullTitle, icon, indicatorClass, label };
        },
        
        init() {
            const carousels = document.querySelectorAll('.carousel');
            
            carousels.forEach(carousel => {
                const container = carousel.closest('.carousel-container');
                const track = carousel.querySelector('.carousel-track');
                const leftArrow = carousel.querySelector('.carousel-arrow-left');
                const rightArrow = carousel.querySelector('.carousel-arrow-right');
                const cards = carousel.querySelectorAll('.carousel-card');
                
                // Indicator functionality
                let indicator = container.querySelector('.carousel-indicator');
                if (indicator) {
                    // Find the index of the first non-livestream card (to start there)
                    const firstVisibleIndex = Array.from(cards).findIndex(card => !card.classList.contains('livestream-card'));

                    // Generate a consistent, labeled selector from the cards.
                    // Rebuilding it also upgrades pages with older hand-written indicators.
                    const generatedTrack = document.createElement('div');
                    generatedTrack.className = 'indicator-track';
                    generatedTrack.setAttribute('role', 'tablist');
                    generatedTrack.setAttribute('aria-label', 'Choose a resource');

                    Array.from(cards).forEach((card, index) => {
                        const meta = this.getCardMeta(card);
                        const tab = document.createElement('button');
                        const icon = document.createElement('i');
                        const label = document.createElement('span');
                        const isFirstVisible = index === firstVisibleIndex;

                        tab.type = 'button';
                        tab.className = `indicator-tab ${meta.indicatorClass}${isFirstVisible ? ' active' : ''}`;
                        tab.dataset.index = index;
                        tab.setAttribute('role', 'tab');
                        tab.setAttribute('aria-label', `Show ${meta.fullTitle}`);
                        tab.setAttribute('aria-selected', isFirstVisible ? 'true' : 'false');
                        tab.title = meta.fullTitle;
                        tab.tabIndex = isFirstVisible ? 0 : -1;

                        icon.className = `fa ${meta.icon} indicator-icon`;
                        icon.setAttribute('aria-hidden', 'true');
                        label.className = 'indicator-label';
                        label.textContent = meta.label;

                        tab.append(icon, label);
                        generatedTrack.appendChild(tab);
                    });

                    indicator.replaceChildren(generatedTrack);
                    
                    const indicatorTabs = indicator.querySelectorAll('.indicator-tab');
                    let isProgrammaticScroll = false; // Flag to prevent flickering

                    // Count how many livestream indicators exist in this carousel
                    const livestreamTabs = Array.from(indicatorTabs).filter(tab =>
                        tab.classList.contains('livestream-indicator')
                    );
                    const hasMultipleLivestreams = livestreamTabs.length > 1;

                    // Simple active state update - maps card index to visible indicator index
                    // Also reveals/hides livestream indicator based on proximity
                    const updateActiveIndicator = (cardIndex) => {
                        // Check if current card is a livestream
                        const currentCard = cards[cardIndex];
                        const isLivestreamActive = currentCard && currentCard.classList.contains('livestream-card');

                        // Update active states
                        indicatorTabs.forEach(tab => {
                            const tabIndex = parseInt(tab.getAttribute('data-index'));
                            const isActive = tabIndex === cardIndex;
                            tab.classList.toggle('active', isActive);
                            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
                            tab.tabIndex = isActive ? 0 : -1;

                            // Reveal livestream indicators
                            if (tab.classList.contains('livestream-indicator')) {
                                if (hasMultipleLivestreams && isLivestreamActive) {
                                    // If multiple livestreams and viewing any livestream, show all
                                    tab.classList.add('revealed');
                                } else if (tabIndex === cardIndex) {
                                    // Otherwise only show the active one
                                    tab.classList.add('revealed');
                                } else {
                                    tab.classList.remove('revealed');
                                }
                            }
                        });
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
                    indicatorTabs.forEach(tab => {
                        tab.addEventListener('click', () => {
                            const cardIndex = parseInt(tab.dataset.index, 10);
                            if (cards[cardIndex]) {
                                // Set flag to prevent scroll event from updating indicator
                                isProgrammaticScroll = true;
                                
                                // Update indicator immediately
                                updateActiveIndicator(cardIndex);
                                
                                const targetScrollLeft = Math.max(0, 
                                    cards[cardIndex].offsetLeft - (track.clientWidth / 2) + (cards[cardIndex].offsetWidth / 2)
                                );
                                
                                track.scrollTo({
                                    left: Math.max(0, targetScrollLeft),
                                    behavior: 'smooth'
                                });
                                
                                // Clear flag after scroll animation completes
                                setTimeout(() => {
                                    isProgrammaticScroll = false;
                                }, 600); // Slightly longer than typical smooth scroll duration
                            }
                        });

                        tab.addEventListener('keydown', event => {
                            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
                            event.preventDefault();

                            const tabs = Array.from(indicatorTabs).filter(candidate =>
                                !candidate.classList.contains('livestream-indicator') || candidate.classList.contains('revealed')
                            );
                            const currentIndex = tabs.indexOf(tab);
                            let targetIndex = currentIndex;

                            if (event.key === 'ArrowLeft') targetIndex = Math.max(0, currentIndex - 1);
                            if (event.key === 'ArrowRight') targetIndex = Math.min(tabs.length - 1, currentIndex + 1);
                            if (event.key === 'Home') targetIndex = 0;
                            if (event.key === 'End') targetIndex = tabs.length - 1;

                            tabs[targetIndex]?.focus();
                            tabs[targetIndex]?.click();
                        });
                    });
                    
                    // Scroll event listener to sync indicator with manual scrolling
                    track.addEventListener('scroll', () => {
                        // Skip updates during programmatic scroll to prevent flickering
                        if (isProgrammaticScroll) return;
                        
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
                    
                    // Initialize: scroll to first visible card (skip livestream) and set indicator
                    // Use setTimeout to ensure mobile layout is complete
                    const initializeScroll = () => {
                        if (firstVisibleIndex > 0 && cards[firstVisibleIndex]) {
                            // Temporarily disable smooth scrolling for instant initial position
                            track.style.scrollBehavior = 'auto';

                            // Scroll to the first non-livestream card (concept card)
                            const targetScrollLeft = Math.max(0,
                                cards[firstVisibleIndex].offsetLeft - (track.clientWidth / 2) + (cards[firstVisibleIndex].offsetWidth / 2)
                            );
                            track.scrollLeft = targetScrollLeft;

                            // Re-enable smooth scrolling after layout settles
                            setTimeout(() => {
                                track.style.scrollBehavior = 'smooth';
                            }, 50);
                        }
                        updateActiveIndicator(firstVisibleIndex >= 0 ? firstVisibleIndex : 0);
                    };

                    // Run immediately and again after a short delay for mobile
                    initializeScroll();
                    setTimeout(initializeScroll, 100);
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
            
            // Also process standalone cards with video IDs (like MiniExam cards)
            const standaloneCards = document.querySelectorAll('.carousel-card.standalone-card[data-video-id]');
            standaloneCards.forEach(card => {
                const videoId = card.getAttribute('data-video-id');
                const cardVideo = card.querySelector('.card-video');
                const img = cardVideo?.querySelector('img');
                
                // Add error handler to images
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

            // Also process part0 cards with video IDs
            const part0Cards = document.querySelectorAll('.part0-card[data-video-id]');
            part0Cards.forEach(card => {
                const videoId = card.getAttribute('data-video-id');
                const cardVideo = card.querySelector('.card-video');
                const img = cardVideo?.querySelector('img');

                if (img) {
                    img.onerror = function() {
                        this.classList.add('placeholder-bg');
                    };
                }

                if (videoId && cardVideo) {
                    const isYouTubeId = /^[a-zA-Z0-9_-]{11}$/.test(videoId);

                    if (isYouTubeId) {
                        if (img) {
                            img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                            img.classList.remove('placeholder-bg');
                            img.alt = 'Video thumbnail';
                        }

                        if (!cardVideo.querySelector('.play-button')) {
                            const playButton = document.createElement('div');
                            playButton.className = 'play-button';
                            playButton.textContent = '▶';
                            cardVideo.appendChild(playButton);
                        }

                        cardVideo.style.cursor = 'pointer';
                        cardVideo.addEventListener('click', () => {
                            window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                        });
                    }
                }
            });
        }
    },

    /* -------------------------------------------------------------------------
       NAVIGATION MODULE (from part.js)
       ------------------------------------------------------------------------- */
    navigation: {
        init() {
            // Create scroll indicator for right sidebar
            const rightNavUl = document.querySelector('.right_div ul');
            const rightNavLinks = Array.from(document.querySelectorAll('.right_div .nav-link-right[href^="#"]'));
            const anchors = rightNavLinks
                .map(link => document.getElementById(decodeURIComponent(link.hash.slice(1))))
                .filter(Boolean);
            let indicator = null;
            let currentActiveId = null;
            let lastActiveLink = null;

            if (rightNavUl) {
                indicator = document.createElement('div');
                indicator.className = 'scroll-indicator';
                rightNavUl.appendChild(indicator);
            }

            // Function to update indicator position with expand/shrink animation
            const updateIndicator = (activeLink) => {
                if (indicator && activeLink) {
                    const newTop = activeLink.offsetTop;
                    const newHeight = activeLink.offsetHeight;

                    if (lastActiveLink && lastActiveLink !== activeLink) {
                        // Get current position
                        const currentTop = parseInt(indicator.style.top) || lastActiveLink.offsetTop;
                        const currentHeight = parseInt(indicator.style.height) || lastActiveLink.offsetHeight;

                        // Calculate expanded position to cover both old and new
                        const expandedTop = Math.min(currentTop, newTop);
                        const expandedBottom = Math.max(currentTop + currentHeight, newTop + newHeight);
                        const expandedHeight = expandedBottom - expandedTop;

                        // First: expand to cover both
                        indicator.style.top = `${expandedTop}px`;
                        indicator.style.height = `${expandedHeight}px`;

                        // Then: shrink to new position after a delay
                        setTimeout(() => {
                            indicator.style.top = `${newTop}px`;
                            indicator.style.height = `${newHeight}px`;
                        }, 150); // Half of the 0.3s transition time
                    } else {
                        // First load or no previous position - just go directly
                        indicator.style.top = `${newTop}px`;
                        indicator.style.height = `${newHeight}px`;
                    }

                    lastActiveLink = activeLink;
                    indicator.style.opacity = '1';
                }
                // Don't hide indicator if no active link - keep it at last position
            };

            const updateActiveNavigation = () => {
                if (anchors.length === 0) return;

                const scrollTop = document.documentElement.scrollTop;
                const viewportMiddle = scrollTop + (window.innerHeight / 2);
                let newActiveId = null;
                let closestDistance = Infinity;

                // Find the section closest to the middle of the viewport
                anchors.forEach(anchor => {
                    const anchorTop = anchor.offsetTop;
                    const anchorHeight = anchor.offsetHeight;
                    const anchorMiddle = anchorTop + (anchorHeight / 2);
                    const distance = Math.abs(viewportMiddle - anchorMiddle);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        newActiveId = anchor.id;
                    }
                });

                // Update active states
                rightNavLinks.forEach(link => {
                    link.classList.toggle('active', link.hash === `#${newActiveId}`);
                });

                // Only update indicator if active section changed
                if (newActiveId !== currentActiveId) {
                    currentActiveId = newActiveId;
                    if (rightNavUl) {
                        const activeLink = rightNavUl.querySelector('.nav-link-right.active');
                        updateIndicator(activeLink);
                    }
                    document.dispatchEvent(new CustomEvent('econ:active-section-change', {
                        detail: { id: newActiveId }
                    }));
                }
            };

            window.addEventListener('scroll', updateActiveNavigation, { passive: true });
            window.addEventListener('resize', updateActiveNavigation);
            requestAnimationFrame(updateActiveNavigation);
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
       MOBILE MENU MODULE
       ------------------------------------------------------------------------- */
    mobileMenu: {
        init() {
            const leftDiv = document.querySelector('.left_div');
            if (!leftDiv) return;

            // Build ordered list: Home, Parts, Projects
            const navItems = [];

            // Add Home
            const homeLink = leftDiv.querySelector('nav ul a[href*="econ-0"]');
            if (homeLink) {
                navItems.push({ label: 'Home', href: homeLink.href });
            }

            // Add Parts
            const partLinks = Array.from(leftDiv.querySelectorAll('nav ul li a')).filter(link =>
                link.textContent.trim().toLowerCase().startsWith('part')
            );
            partLinks.forEach(link => {
                navItems.push({ label: link.textContent.trim(), href: link.href, isActive: link.classList.contains('active') });
            });

            // Add Projects
            const projectsLink = Array.from(leftDiv.querySelectorAll('nav ul li a')).find(link =>
                link.textContent.trim().toLowerCase() === 'projects'
            );
            if (projectsLink) {
                navItems.push({ label: 'Projects', href: projectsLink.href, isActive: projectsLink.classList.contains('active') });
            }

            if (navItems.length === 0) return;

            // Find current page index
            let currentIndex = navItems.findIndex(item => item.isActive);

            // Check if we're on the home page
            const currentPath = window.location.pathname;
            if (currentIndex === -1 && homeLink && (currentPath.endsWith('econ-0150.html') || currentPath.endsWith('econ-0100.html'))) {
                currentIndex = 0; // Home
            }

            if (currentIndex === -1) currentIndex = 0;

            const sectionItems = Array.from(document.querySelectorAll('.right_div .nav-link-right')).map(link => ({
                href: link.href,
                isActive: link.classList.contains('active'),
                label: link.textContent.trim()
            }));

            // Create the compact bottom bar.
            const navBar = document.createElement('nav');
            navBar.className = 'mobile-nav-bar';
            navBar.setAttribute('aria-label', 'Course navigation');

            // Previous arrow (wraps around)
            const prevIndex = (currentIndex - 1 + navItems.length) % navItems.length;
            const prevLink = document.createElement('a');
            prevLink.innerHTML = '‹';
            prevLink.className = 'mobile-nav-step';
            prevLink.setAttribute('aria-label', `Previous: ${navItems[prevIndex].label}`);
            prevLink.href = navItems[prevIndex].href;

            // The current-page control opens the full course and page menu.
            const label = document.createElement('button');
            label.type = 'button';
            label.className = 'mobile-nav-label';
            label.setAttribute('aria-expanded', 'false');
            label.setAttribute('aria-controls', 'mobile-course-menu');
            label.innerHTML = `<span>${navItems[currentIndex].label}</span><i class="fa fa-chevron-up" aria-hidden="true"></i>`;

            // Next arrow (wraps around)
            const nextIndex = (currentIndex + 1) % navItems.length;
            const nextLink = document.createElement('a');
            nextLink.innerHTML = '›';
            nextLink.className = 'mobile-nav-step';
            nextLink.setAttribute('aria-label', `Next: ${navItems[nextIndex].label}`);
            nextLink.href = navItems[nextIndex].href;

            const menu = document.createElement('div');
            menu.id = 'mobile-course-menu';
            menu.className = 'mobile-nav-menu';
            menu.hidden = true;
            const sectionMenuLinks = [];

            const addMenuGroup = (heading, items) => {
                if (items.length === 0) return;

                const group = document.createElement('div');
                const title = document.createElement('div');
                const links = document.createElement('div');

                group.className = 'mobile-nav-menu-group';
                title.className = 'mobile-nav-menu-title';
                title.textContent = heading;
                links.className = 'mobile-nav-menu-links';

                items.forEach(item => {
                    const link = document.createElement('a');
                    link.href = item.href;
                    link.textContent = item.label;
                    if (item.isActive) {
                        link.classList.add('is-current');
                        link.setAttribute('aria-current', heading === 'On this page' ? 'location' : 'page');
                    }
                    if (heading === 'On this page') {
                        sectionMenuLinks.push(link);
                    }
                    links.appendChild(link);
                });

                group.append(title, links);
                menu.appendChild(group);
            };

            addMenuGroup('Course', navItems);
            addMenuGroup('On this page', sectionItems);

            document.addEventListener('econ:active-section-change', event => {
                const activeHash = event.detail?.id ? `#${event.detail.id}` : '';
                sectionMenuLinks.forEach(link => {
                    const isActive = link.hash === activeHash;
                    link.classList.toggle('is-current', isActive);
                    if (isActive) {
                        link.setAttribute('aria-current', 'location');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
            });

            // Create dividers
            const divider1 = document.createElement('span');
            divider1.className = 'mobile-nav-divider';
            const divider2 = document.createElement('span');
            divider2.className = 'mobile-nav-divider';

            const closeMenu = () => {
                menu.hidden = true;
                label.setAttribute('aria-expanded', 'false');
                label.querySelector('i')?.classList.replace('fa-chevron-down', 'fa-chevron-up');
            };

            label.addEventListener('click', () => {
                const willOpen = menu.hidden;
                menu.hidden = !willOpen;
                label.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
                label.querySelector('i')?.classList.replace(
                    willOpen ? 'fa-chevron-up' : 'fa-chevron-down',
                    willOpen ? 'fa-chevron-down' : 'fa-chevron-up'
                );
            });

            menu.addEventListener('click', event => {
                if (event.target.closest('a')) closeMenu();
            });

            document.addEventListener('click', event => {
                if (!navBar.contains(event.target)) closeMenu();
            });

            document.addEventListener('keydown', event => {
                if (event.key === 'Escape' && !menu.hidden) {
                    closeMenu();
                    label.focus();
                }
            });

            navBar.append(menu, prevLink, divider1, label, divider2, nextLink);
            document.body.appendChild(navBar);
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

                // Video playback is handled by the per-card .card-video
                // click handlers in the carousel module
            });
        }
    },

    /* -------------------------------------------------------------------------
       TOPIC TOGGLE MODULE
       ------------------------------------------------------------------------- */
    topicToggle: {
        init() {
            document.querySelectorAll('.topic-toggle').forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const cards = toggle.nextElementSibling;
                    if (!cards) return;
                    const btn = toggle.querySelector('.btn');
                    cards.classList.toggle('collapsed');
                    if (btn) {
                        btn.textContent = btn.textContent.replace(/^[▶▼]\s*/, '');
                        btn.textContent = (cards.classList.contains('collapsed') ? '▶ ' : '▼ ') + btn.textContent;
                    }
                });
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
            this.mobileMenu.init();
            this.topicToggle.init();
        });
    }
};

// Initialize the application
EconApp.init();
