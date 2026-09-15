/* =============================================================================
   COURSE.JS - plain-JS rewrite of scripts/main.js. No build step, no classes.
   ============================================================================= */

// Tiny helper: create an element and set some properties on it in one line.
function el(tag, props) { return Object.assign(document.createElement(tag), props); }

// Wire up whatever is on the page. Static pages load this in <head> and it waits for
// DOMContentLoaded; the course-page.js renderer inserts it after it has built the page,
// by which time the document is already parsed, so it runs at once. Either way, once.
let courseContentCleanup = [];
function courseRefreshContent() {
  courseContentCleanup.forEach(cleanup => cleanup());
  courseContentCleanup = [];
  setupCarousels();
  setupVideoCards();
  setupNavScrollSpy();
  setupActiveCardHighlighting();
  setupTopicToggles();
  setupPathDates();
}
function courseInit() { courseRefreshContent(); setupMobileNav(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', courseInit);
else courseInit();

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
  const updateScrollSpy = () => {
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
  };
  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  courseContentCleanup.push(() => window.removeEventListener('scroll', updateScrollSpy));
}

// Marks the carousel card nearest its track's center as .active while that
// carousel is on screen.
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
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        track.addEventListener('scroll', updateActiveCard);
        updateActiveCard();
      } else {
        track.removeEventListener('scroll', updateActiveCard);
        cards.forEach(card => card.classList.remove('active'));
      }
    }), options);
    observer.observe(container);
    courseContentCleanup.push(() => observer.disconnect());
  });
}

// Mobile part toolbar. Ordinary links preserve the browser’s normal page
// loading, history, and new-tab behavior on both file URLs and hosted pages.
function setupMobileNav() {
  const leftDiv = document.querySelector('.left_div');
  if (!leftDiv || document.querySelector('.mobile-nav-bar')) return;
  const links = Array.from(leftDiv.querySelectorAll('nav ul a'));
  const parts = links.filter(link => /^Part\s+\S+$/i.test(link.textContent.trim()));
  if (!parts.length) return;
  const samePage = href => new URL(href, location.href).pathname === location.pathname;
  let current = parts.findIndex(link => samePage(link.href));
  const nav = el('nav', { className: 'mobile-nav-bar' });
  nav.setAttribute('aria-label', 'Course navigation');
  const extras = [];
  const home = links.find(link => /\/econ-0\d+\.html$/.test(new URL(link.href).pathname));
  const projects = links.find(link => link.textContent.trim() === 'Projects');
  if (home) extras.push(['Home', home.href]);
  if (projects) extras.push(['Projects', projects.href]);
  if (extras.length) {
    const utilities = el('div', { className: 'mobile-nav-utilities' });
    extras.forEach(([label, href]) => {
      const link = el('a', { href, title: label });
      link.setAttribute('aria-label', label);
      const paths = label === 'Home'
        ? '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>'
        : '<path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>';
      link.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
      if (samePage(href)) link.setAttribute('aria-current', 'page');
      utilities.append(link);
    });
    const divider = el('span', { className: 'mobile-nav-divider', textContent: '|' });
    divider.setAttribute('aria-hidden', 'true');
    nav.append(utilities, divider);
    nav.classList.add('has-utilities');
  }
  const row = el('div', { className: 'mobile-nav-parts' });
  const partLinks = parts.map(source => {
    const label = source.textContent.trim();
    const link = el('a', { className: 'mobile-nav-part', href: source.href });
    link.setAttribute('aria-label', label);
    link.textContent = label.replace(/^Part\s+/i, '');
    row.append(link);
    return link;
  });
  function select(index) {
    partLinks.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }
  select(current);
  nav.append(row);
  document.body.append(nav);
  document.body.classList.add('has-mobile-course-nav');


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

// Practice path: steps carry data-date (yyyy-mm-dd). From the day after its date a
// step is marked "past" and its dot turns the brand blue: the date has been and gone.
// Append ?today=2026-09-03 to the URL to preview another day.
function setupPathDates() {
  const override = new URLSearchParams(location.search).get('today');
  const today = (override || new Date().toLocaleDateString('en-CA')).slice(0, 10); // en-CA gives yyyy-mm-dd
  document.querySelectorAll('.path-step[data-date]').forEach(step => {
    if (step.dataset.date < today) step.classList.add('past');
  });
}
