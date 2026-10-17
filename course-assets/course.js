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

// Phone toolbar: a glass pill of part letters and, beside it, a round button that names
// the block in view and opens a sheet with this part's contents and the course notes
// (office hours, the syllabus) that the hidden side navs carry on wider screens. Ordinary
// links preserve the browser's normal page loading, history, and new-tab behavior on both
// file URLs and hosted pages. Everything is read from the rendered navs, so a page needs
// only a left nav with Part links; the contents section comes from the right nav when present.
function setupMobileNav() {
  const leftDiv = document.querySelector('.left_div');
  if (!leftDiv || document.querySelector('.mobile-dock')) return;
  const links = Array.from(leftDiv.querySelectorAll('nav ul a'));
  const parts = links.filter(link => /^Part\s+\S+$/i.test(link.textContent.trim()));
  if (!parts.length) return;
  const samePage = href => new URL(href, location.href).pathname === location.pathname;
  const svg = paths => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

  const dock = el('div', { className: 'mobile-dock' });
  const bar = el('nav', { className: 'mobile-nav-bar' });
  bar.setAttribute('aria-label', 'Course parts');
  parts.forEach(source => {
    const label = source.textContent.trim();
    const link = el('a', { className: 'mobile-nav-part', href: source.href, textContent: label.replace(/^Part\s+/i, '') });
    link.setAttribute('aria-label', label);
    if (samePage(source.href)) link.setAttribute('aria-current', 'page');
    bar.append(link);
  });

  // The sheet: this part's sections, then the course notes and buttons.
  const sheet = el('div', { className: 'mobile-sheet', id: 'mobile-sheet', hidden: true });
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-label', 'Contents and course information');
  const sections = Array.from(document.querySelectorAll('.right_div .nav-link-right')).map(source => {
    const row = el('a', { className: 'mobile-sheet-row', href: source.getAttribute('href') });
    // Table-of-contents row: the block number in its own column, so a long title wraps
    // under itself, and the date on a quiet line below the title.
    const text = el('span', { className: 'mobile-sheet-text' });
    text.append(el('span', { className: 'mobile-sheet-name', textContent: source.dataset.name || source.textContent.trim() }));
    if (source.dataset.date) text.append(el('span', { className: 'mobile-sheet-date', textContent: source.dataset.date }));
    row.append(el('span', { className: 'mobile-sheet-id', textContent: source.dataset.short || '' }), text);
    return { row, id: source.getAttribute('href').slice(1), short: source.dataset.short || '' };
  });
  const current = parts.find(link => samePage(link.href));
  if (sections.length) {
    sheet.append(el('div', { className: 'mobile-sheet-heading', textContent: current ? `In ${current.textContent.trim()}` : 'Contents' }));
    sections.forEach(section => sheet.append(section.row));
  }
  leftDiv.querySelectorAll('.nav-note').forEach(note => {
    const label = note.querySelector('.nav-note-label');
    sheet.append(el('div', { className: 'mobile-sheet-heading', textContent: label ? label.textContent : '' }));
    const lines = el('div', { className: 'mobile-sheet-note' });
    note.querySelectorAll('.nav-note-line').forEach(line => lines.append(line.cloneNode(true)));
    sheet.append(lines);
  });
  // Buttons: the brand's home link, then every other non-part link (Syllabus, Projects).
  const buttons = el('div', { className: 'mobile-sheet-buttons' });
  const brand = leftDiv.querySelector('nav ul > a.brand');
  if (brand) buttons.append(el('a', { className: 'mobile-sheet-button', href: brand.href, textContent: 'Home' }));
  links.filter(link => !parts.includes(link) && !link.classList.contains('brand')).forEach(source => {
    const link = el('a', { className: 'mobile-sheet-button', href: source.href, textContent: source.textContent.trim() });
    if (source.target) { link.target = source.target; link.rel = 'noopener'; }
    if (samePage(source.href)) link.setAttribute('aria-current', 'page');
    buttons.append(link);
  });
  if (buttons.children.length) sheet.append(buttons);

  // The round button: the block in view (C1, 1.2), or a list glyph above the first block
  // and on a checkpoint or project; an X while the sheet is open.
  const more = el('button', { className: 'mobile-nav-more', type: 'button' });
  more.setAttribute('aria-controls', sheet.id);
  more.setAttribute('aria-expanded', 'false');
  more.setAttribute('aria-label', 'Contents and course information');
  const moreLabel = el('span', { className: 'mobile-nav-more-label' });
  const moreIcon = el('span', { className: 'mobile-nav-more-icon' });
  moreIcon.innerHTML = svg('<path d="M4 7h16M4 12h16M4 17h10"/>');
  const closeIcon = el('span', { className: 'mobile-nav-more-close' });
  closeIcon.innerHTML = svg('<path d="M6 6l12 12M18 6 6 18"/>');
  more.append(moreLabel, moreIcon, closeIcon);

  const scrim = el('div', { className: 'mobile-scrim', hidden: true });
  dock.append(bar, more);
  document.body.append(scrim, sheet, dock);
  document.body.classList.add('has-mobile-course-nav');

  // Which section is in view: the last one whose top has passed 40% of the window.
  const updateSection = () => {
    const line = window.innerHeight * 0.4;
    let active = null;
    sections.forEach(section => {
      const target = document.getElementById(section.id);
      if (target && target.getBoundingClientRect().top <= line) active = section;
    });
    sections.forEach(section => section.row.classList.toggle('current', section === active));
    const short = active ? active.short : '';
    if (moreLabel.textContent !== short) moreLabel.textContent = short;
    more.classList.toggle('has-label', Boolean(short));
  };
  updateSection();
  window.addEventListener('scroll', updateSection, { passive: true });
  window.addEventListener('resize', updateSection, { passive: true });
  window.addEventListener('load', updateSection);   // thumbnails arriving move the sections

  const setOpen = open => {
    sheet.hidden = !open;
    scrim.hidden = !open;
    more.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('mobile-sheet-open', open);
    if (open) (sheet.querySelector('.mobile-sheet-row.current') || sheet.querySelector('a') || sheet).focus({ preventScroll: true });
  };
  more.addEventListener('click', () => setOpen(sheet.hidden));
  scrim.addEventListener('click', () => setOpen(false));
  sheet.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !sheet.hidden) { setOpen(false); more.focus(); }
  });
  // Leaving phone width with the sheet open would strand it.
  window.matchMedia('(min-width: 651px)').addEventListener('change', event => { if (event.matches) setOpen(false); });
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
