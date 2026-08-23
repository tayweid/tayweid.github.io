/* =============================================================================
   COURSE.JS - plain-JS rewrite of scripts/main.js. No build step, no classes.
   ============================================================================= */

// Tiny helper: create an element and set some properties on it in one line.
function el(tag, props) { return Object.assign(document.createElement(tag), props); }
document.addEventListener('DOMContentLoaded', () => {
  setupCarousels();
  setupVideoCards();
  setupNavScrollSpy();
  setupActiveCardHighlighting();
  setupMobileNav();
  setupTopicToggles();
  setupPathDates();
});

// Carousel: arrows page the track; dots are built from card type, clicking a
// dot jumps to that card, and scrolling the track keeps the dots in sync.
function setupCarousels() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const container = carousel.closest('.carousel-container');
    const track = carousel.querySelector('.carousel-track');
    const leftArrow = carousel.querySelector('.carousel-arrow-left');
    const rightArrow = carousel.querySelector('.carousel-arrow-right');
    const cards = carousel.querySelectorAll('.carousel-card');
    const indicator = container && container.querySelector('.carousel-indicator');
    if (leftArrow) leftArrow.addEventListener('click', () => track.scrollBy({ left: -400, behavior: 'smooth' }));
    if (rightArrow) rightArrow.addEventListener('click', () => track.scrollBy({ left: 400, behavior: 'smooth' }));
    if (!indicator) return;
    // Build the dots once. First non-livestream card starts active.
    const firstVisible = Array.from(cards).findIndex(c => !c.classList.contains('livestream-card'));
    if (!indicator.querySelector('.indicator-track')) {
      const dots = Array.from(cards).map((card, i) => {
        const type = card.classList.contains('livestream-card') ? 'livestream-indicator'
          : card.classList.contains('concept-card') ? 'concept-indicator'
          : card.classList.contains('exercise-card') ? 'exercise-indicator'
          : card.classList.contains('homework-card') ? 'homework-indicator' : '';
        return `<button class="indicator-tab ${type}${i === firstVisible ? ' active' : ''}" data-index="${i}"></button>`;
      }).join('');
      indicator.innerHTML = `<div class="indicator-track">${dots}</div>`;
    }
    const tabs = indicator.querySelectorAll('.indicator-tab');
    const multipleLivestreams = Array.from(tabs).filter(t => t.classList.contains('livestream-indicator')).length > 1;
    let ignoreScroll = false; // true while we scroll the track programmatically
    const setActiveDot = (cardIndex) => {
      const onLivestream = cards[cardIndex] && cards[cardIndex].classList.contains('livestream-card');
      tabs.forEach(tab => {
        const i = Number(tab.dataset.index);
        tab.classList.toggle('active', i === cardIndex);
        if (tab.classList.contains('livestream-indicator')) {
          tab.classList.toggle('revealed', i === cardIndex || (multipleLivestreams && onLivestream));
        }
      });
    };
    const scrollToCard = (index) => {
      const card = cards[index];
      if (card) track.scrollTo({ left: Math.max(0, card.offsetLeft - track.clientWidth / 2 + card.offsetWidth / 2), behavior: 'smooth' });
    };
    tabs.forEach((tab, i) => tab.addEventListener('click', () => {
      ignoreScroll = true;
      setActiveDot(i);
      scrollToCard(i);
      setTimeout(() => { ignoreScroll = false; }, 600); // ~ smooth-scroll duration
    }));
    // Debounced: pick whichever card sits closest to the track's center.
    let scrollTimer = null;
    track.addEventListener('scroll', () => {
      if (ignoreScroll) return;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const center = track.getBoundingClientRect().left + track.clientWidth / 2;
        let closest = 0, closestDist = Infinity;
        cards.forEach((card, i) => {
          const dist = Math.abs(card.getBoundingClientRect().left + card.offsetWidth / 2 - center);
          if (dist < closestDist) { closestDist = dist; closest = i; }
        });
        setActiveDot(closest);
      }, 50);
    });
    // Land on the first non-livestream card. Runs twice since mobile
    // layout can still be settling right after page load.
    const startIndex = firstVisible >= 0 ? firstVisible : 0;
    const jumpToStart = () => {
      if (startIndex > 0 && cards[startIndex]) {
        track.style.scrollBehavior = 'auto';
        track.scrollLeft = Math.max(0, cards[startIndex].offsetLeft - track.clientWidth / 2 + cards[startIndex].offsetWidth / 2);
        setTimeout(() => { track.style.scrollBehavior = 'smooth'; }, 50);
      }
      setActiveDot(startIndex);
    };
    jumpToStart();
    setTimeout(jumpToStart, 100);
  });
}

// Video thumbnails: fill in the YouTube preview image, add a play button,
// and open the video in a new tab on click.
function setupVideoCards() {
  const selectors = [
    '.carousel .carousel-card[data-video-id]',
    '.carousel-card.standalone-card[data-video-id]',
    '.part0-card[data-video-id]',
    '.path-episode[data-video-id]'
  ];
  selectors.forEach(selector => document.querySelectorAll(selector).forEach(card => {
    const videoId = card.getAttribute('data-video-id');
    const cardVideo = card.querySelector('.card-video');
    // The 11-char check also skips "" and the literal "default".
    if (!cardVideo || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return;
    const img = cardVideo.querySelector('img');
    if (img) {
      // A real video: show the thumbnail; fall back to the placeholder look if it fails to load.
      img.classList.remove('placeholder-bg');
      img.onerror = () => img.classList.add('placeholder-bg');
      if (!img.getAttribute('src')) img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    if (!cardVideo.querySelector('.play-button')) cardVideo.appendChild(el('div', { className: 'play-button', textContent: '▶' }));
    cardVideo.addEventListener('click', () => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank'));
  }));
}

// Right-nav scroll spy: highlight whichever section is nearest the
// viewport's vertical center, and slide a bar to match in the sidebar.
function setupNavScrollSpy() {
  const rightNavUl = document.querySelector('.right_div ul');
  const navLinks = document.querySelectorAll('.nav-link-right');
  if (!rightNavUl || navLinks.length === 0) return;
  const indicator = el('div', { className: 'scroll-indicator' });
  rightNavUl.appendChild(indicator);
  window.addEventListener('scroll', () => {
    const viewportMiddle = document.documentElement.scrollTop + window.innerHeight / 2;
    let activeId = null, closestDist = Infinity;
    document.querySelectorAll('div[id]').forEach(section => {
      const dist = Math.abs(viewportMiddle - (section.offsetTop + section.offsetHeight / 2));
      if (dist < closestDist) { closestDist = dist; activeId = section.id; }
    });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`));
    const activeLink = rightNavUl.querySelector('.nav-link-right.active');
    if (activeLink) {
      indicator.style.top = `${activeLink.offsetTop}px`;
      indicator.style.height = `${activeLink.offsetHeight}px`;
      indicator.style.opacity = '1';
    }
  });
}

// Marks the carousel card nearest its track's center as .active while that
// carousel is on screen; does the same for the mini-exam standalone cards.
function setupActiveCardHighlighting() {
  const options = { root: null, rootMargin: '-30% 0px -30% 0px', threshold: 0 };
  document.querySelectorAll('.carousel-container').forEach(container => {
    const track = container.querySelector('.carousel-track');
    const cards = container.querySelectorAll('.carousel-card');
    if (!track) return;
    const updateActiveCard = () => {
      const trackRect = track.getBoundingClientRect();
      cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const centered = Math.abs(cardRect.left + cardRect.width / 2 - trackRect.left - track.clientWidth / 2) < 50;
        card.classList.toggle('active', centered && !card.classList.contains('placeholder'));
      });
    };
    new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        track.addEventListener('scroll', updateActiveCard);
        updateActiveCard();
      } else {
        track.removeEventListener('scroll', updateActiveCard);
        cards.forEach(card => card.classList.remove('active'));
      }
    }), options).observe(container);
  });
  const miniexam = document.getElementById('miniexam');
  const standaloneCards = miniexam && miniexam.querySelectorAll('.standalone-card');
  if (standaloneCards && standaloneCards.length) {
    new IntersectionObserver(entries => entries.forEach(entry => {
      standaloneCards.forEach(card => card.classList.toggle('active', entry.isIntersecting));
    }), options).observe(miniexam);
  }
}

// Mobile bottom nav: Home (if there's an econ-0... link), each "Part ..."
// link, then Projects; prev/next arrows wrap around the ends.
function setupMobileNav() {
  const leftDiv = document.querySelector('.left_div');
  if (!leftDiv) return;
  const navItems = [];
  const homeLink = leftDiv.querySelector('nav ul a[href*="econ-0"]');
  if (homeLink) navItems.push({ label: 'Home', href: homeLink.href });
  leftDiv.querySelectorAll('nav ul li a').forEach(link => {
    const text = link.textContent.trim();
    if (text.toLowerCase().startsWith('part')) navItems.push({ label: text, href: link.href, isActive: link.classList.contains('active') });
  });
  const projectsLink = Array.from(leftDiv.querySelectorAll('nav ul li a')).find(link => link.textContent.trim().toLowerCase() === 'projects');
  if (projectsLink) navItems.push({ label: 'Projects', href: projectsLink.href, isActive: projectsLink.classList.contains('active') });
  if (navItems.length === 0) return;
  let currentIndex = navItems.findIndex(item => item.isActive);
  const path = window.location.pathname;
  if (currentIndex === -1 && homeLink && (path.endsWith('econ-0150.html') || path.endsWith('econ-0100.html'))) currentIndex = 0;
  if (currentIndex === -1) currentIndex = 0;
  const prevItem = navItems[(currentIndex - 1 + navItems.length) % navItems.length];
  const nextItem = navItems[(currentIndex + 1) % navItems.length];
  const navArrow = (html, href, label) => { const a = el('a', { innerHTML: html, href }); a.setAttribute('aria-label', label); return a; };
  const prevLink = navArrow('‹', prevItem.href, 'Previous');
  const nextLink = navArrow('›', nextItem.href, 'Next');
  const label = el('span', { className: 'mobile-nav-label', textContent: navItems[currentIndex].label });
  const navBar = el('div', { className: 'mobile-nav-bar' });
  navBar.append(prevLink, el('span', { className: 'mobile-nav-divider' }), label, el('span', { className: 'mobile-nav-divider' }), nextLink);
  document.body.appendChild(navBar);
}

// Topic toggle: click collapses/expands the card list below it and flips
// the ▶ / ▼ glyph in front of the header's label.
function setupTopicToggles() {
  document.querySelectorAll('.topic-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const cards = toggle.nextElementSibling;
      if (!cards) return;
      cards.classList.toggle('collapsed');
      const btn = toggle.querySelector('.btn');
      if (btn) {
        const label = btn.textContent.replace(/^[▶▼]\s*/, '');
        btn.textContent = (cards.classList.contains('collapsed') ? '▶ ' : '▼ ') + label;
      }
    });
  });
}

// Practice path: steps carry data-date (yyyy-mm-dd). From the day after its
// date a step is "current"; earlier ones are "past". Append ?today=2026-09-03
// to the URL to preview another day.
function setupPathDates() {
  const steps = Array.from(document.querySelectorAll('.path-step[data-date]'));
  if (!steps.length) return;
  const override = new URLSearchParams(location.search).get('today');
  const today = (override || new Date().toLocaleDateString('en-CA')).slice(0, 10); // en-CA gives yyyy-mm-dd
  const arrived = steps.map(s => s.dataset.date).filter(d => d < today).sort();   // a step is current from the day after
  if (!arrived.length) return;
  const latest = arrived[arrived.length - 1];   // blocks sharing a day are current together
  steps.forEach(step => {
    if (step.dataset.date === latest) step.classList.add('current');
    else if (step.dataset.date < latest) step.classList.add('past');
  });
}
