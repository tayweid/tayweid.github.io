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
  setupEpisodeMore();
}

// A long episode description is held to a few lines (course.css: five on a wide card, three on a
// smaller one). Where it is cut short, a More button under it opens it, and Less closes it again;
// checked again when the window's width changes.
function setupEpisodeMore() {
  const panels = Array.from(document.querySelectorAll('.bc-episode')).filter(panel => panel.querySelector('.bc-epdesc'));
  if (!panels.length) return;
  const check = () => panels.forEach(panel => {
    const desc = panel.querySelector('.bc-epdesc');
    const open = panel.classList.contains('bc-open');
    const cut = !open && desc.scrollHeight > desc.clientHeight + 1;
    let button = panel.querySelector('.bc-more');
    if (!button && (cut || open)) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'bc-more';
      button.addEventListener('click', () => { panel.classList.toggle('bc-open'); check(); });
      panel.querySelector('.bc-ephead').append(button);
    }
    if (!button) return;
    button.hidden = !cut && !open;
    button.textContent = open ? 'Less' : 'More';
    button.setAttribute('aria-expanded', String(open));
  });
  let width = innerWidth;
  const onResize = () => { if (innerWidth !== width) { width = innerWidth; check(); } };
  window.addEventListener('resize', onResize);
  courseContentCleanup.push(() => window.removeEventListener('resize', onResize));
  check();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(check);
}
// A course with the course column has no bottom bar on a phone: the column is its navigation there too.
function courseInit() { courseRefreshContent(); if (!setupCourseColumn()) setupMobileNav(); }
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

// The course column (course-page.js draws it for courses on the row card). On a wide window it is
// the left sidebar, names beside its dashes and letters. Narrower, only the dashes and letters show,
// beside the page (a narrow window) or in a gutter (a phone), and a tap opens them into a card: the
// rows spread, the names fade in, and the row the card opened around stays put. A mouse goes straight
// to what the closed column shows by name (the house, a letter, this part's ticks); a click on another
// part's faint dashes opens the card like a tap. It marks
// the block on screen, tints the stretch of the column this page covers with a brighter band over what
// the window shows, names any dash at once under a pointer, and a finger sliding along the closed column moves
// through the page, or, onto another part, opens that part on release.
function setupCourseColumn() {
  const card = document.querySelector('.cc');
  if (!card) return false;
  if (card.dataset.ready) return true;
  card.dataset.ready = 'true';
  const root = document.documentElement;
  const list = card.querySelector('.cc-rows');
  const content = document.querySelector('main.content') || document.querySelector('.content');
  const KINDS = ['wordmark', 'home', 'start', 'part', 'block', 'cp', 'faint', 'end'];
  const rows = Array.from(list.querySelectorAll('.cc-r')).map(node => {
    const target = node.dataset.target;
    const href = node.getAttribute('href');
    return {
      node, kind: KINDS.find(kind => node.classList.contains(`cc-${kind}`)) || 'block',
      here: node.classList.contains('cc-here'), mine: node.hasAttribute('data-mine'),
      el: target ? document.getElementById(target) : null,
      href: !target && href && href !== '#' ? node.href : null,
      tip: node.dataset.tip || ''
    };
  });
  const headRow = rows.find(row => row.here) || rows[0];
  const mineRows = rows.filter(row => row.mine);

  const scrim = el('div', { className: 'cc-scrim', hidden: true });
  const tip = el('div', { className: 'cc-tip' });
  const bubble = el('div', { className: 'cc-bubble' });
  const bubbleTitle = el('b');
  const bubbleSub = el('span');
  bubble.append(bubbleTitle, bubbleSub);
  const pageMark = el('span', { className: 'cc-mark' });
  const viewMark = el('span', { className: 'cc-mark cc-view' });
  list.prepend(pageMark, viewMark);
  document.body.append(scrim, tip, bubble);

  // The rail is the same at every width: a wide sidebar, a narrow window's closed column and a phone's
  // all space their rows alike, so it keeps its length when the names go. The part letters space alike
  // and the long dash like the faint ones; home's row is a letter's and 5 px more, the house standing
  // at its foot (the start row under it has no height left, and only carries the wordmark's line);
  // this page's blocks sit close together, set apart by a little room. Opened into a card, the blocks
  // spread to OPEN's height, room for a finger. The wordmark shows only on a wide window, a little
  // shorter than itself so the house sits beside the foot of it.
  const WIDE = 1334;   // the window that fits the sidebar beside a centered page (course.css)
  const CLUMP = 20;    // the rows for this page's blocks: close together, one group under the part's name
  const ROOM = 10;     // and the room that sets the part apart: above its name, around its group of blocks
  const PADV = 8, WORDMARK = 44, TOP = 46;   // TOP: the wide sidebar's sticky top (course.css)
  const OPEN = { wordmark: 0, home: 35, start: 0, part: 30, block: 30, cp: 30, faint: 5, end: 30 };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ease = k => 1 - Math.pow(1 - k, 3);
  let mode = '', p = 0, target = 0, anim = 0, anchorY = null, anchorRow = 0, frame = 0;
  let cur = null, hot = null, down = null, pending = null, swallowClick = false;

  // Framed (in Canvas, say), a page zooms itself out to show its 1240 px layout (the inline script in
  // each page). The browser then measures the window, boxes and scrolling in the frame's pixels, while
  // the column's own lengths are in the page's: these convert. Unframed, they change nothing.
  const zoom = () => parseFloat(root.style.zoom) || 1;
  const rectScale = () => { const el = content || root; return el.offsetWidth ? el.getBoundingClientRect().width / el.offsetWidth : 1; };
  const pageWidth = () => innerWidth / zoom();

  // The window's height the closed column is placed against. On a touch screen it is the height the
  // page was laid out at, kept until the width changes (the phone turns): Safari and Brave on a phone
  // grow and shrink their toolbars as you scroll, and following them would move the rail.
  const touch = window.matchMedia('(pointer: coarse)');
  let tall = innerHeight / zoom(), tallAt = innerWidth;
  const windowHeight = () => {
    if (!touch.matches || innerWidth !== tallAt) { tall = innerHeight / zoom(); tallAt = innerWidth; }
    return tall;
  };

  const heightAt = (row, q) => {
    if (mode === 'wide' && row.kind === 'wordmark') return WORDMARK;
    const rail = row.kind === 'block' || row.kind === 'cp' ? CLUMP : OPEN[row.kind];
    return mode === 'wide' ? rail : rail + (OPEN[row.kind] - rail) * q;
  };
  // this page's own rows (not its letter or the house): the group the tint marks
  const own = rows.map((row, i) => row.mine && row !== headRow ? i : -1).filter(i => i >= 0);
  const headAt = headRow.kind === 'part' ? rows.indexOf(headRow) : -1;
  const roomBefore = i => i === headAt || (own.length && (i === own[0] || i === own[own.length - 1] + 1)) ? ROOM : 0;
  // A window too short for the rail (a phone turned sideways) squeezes its spacing to fit, to half at
  // most; the letters, ticks and house keep their size. A wide sidebar never squeezes: its names need
  // their rows.
  function offsets(q) {
    let y = 0, full = 0;
    rows.forEach((row, i) => { full += roomBefore(i) + heightAt(row, q); });
    const k = mode === 'wide' ? 1 : Math.max(0.5, Math.min(1, (windowHeight() - 16 - 2 * PADV) / full));
    return rows.map((row, i) => { const room = roomBefore(i) * k; y += room; const h = heightAt(row, q) * k; const top = y; y += h; return { top, h, mid: top + h / 2, room }; })
      .concat([{ top: y }]);
  }

  // Two lenses (after ManimLive's and Plass's rails): this page's stretch of the column, from a little
  // above its first block to a little below its last, faintly tinted, the part's letter (or the house)
  // above it; and inside it a brighter band over what the window shows, gliding as the page scrolls.
  function placeMarks(o) {
    const first = own.length ? own[0] : rows.indexOf(headRow);
    const last = own.length ? own[own.length - 1] : first;
    const padTop = Math.min(13, o[first].h / 2 + 1);
    const padBottom = Math.min(13, o[last].h / 2 + 1);
    pageMark.style.top = `${o[first].mid - padTop}px`;
    pageMark.style.height = `${Math.max(4, o[last].mid + padBottom - (o[first].mid - padTop))}px`;
    // where the window is, as a place on the column: between two of this page's rows as the page
    // runs between their sections
    const at = docY => {
      const measured = mineRows.filter(row => row.yd !== undefined);
      let k = 0;
      while (k + 1 < measured.length && measured[k + 1].yd <= docY) k += 1;
      const from = measured[k], next = measured[k + 1];
      const a = o[rows.indexOf(from)], b = next ? o[rows.indexOf(next)] : null;
      const end = next ? next.yd : Math.max(from.yd + 1, root.scrollHeight);
      const t = Math.min(1, Math.max(0, (docY - from.yd) / Math.max(1, end - from.yd)));
      return b ? a.mid + t * (b.mid - a.mid) : a.mid + t * (a.h / 2 + 4);
    };
    const top = Math.max(o[first].mid - padTop, at(scrollY) - padTop);
    const bottom = Math.min(o[last].mid + padBottom, at(scrollY + innerHeight) + padBottom);
    viewMark.style.top = `${top}px`;
    viewMark.style.height = `${Math.max(8, bottom - top)}px`;
  }

  function layout() {
    const q = mode === 'wide' ? 1 : p;
    const o = offsets(q);
    rows.forEach((row, i) => {
      row.node.style.height = `${o[i].h}px`;
      row.node.style.marginTop = `${o[i].room}px`;
      row.node.style.setProperty('--gy', `${o[i].h / 2}px`);
    });
    card.style.setProperty('--q', mode === 'wide' ? 1 : Math.max(0, Math.min(1, (p - 0.35) / 0.65)));
    card.style.setProperty('--p', mode === 'wide' ? 0 : p);
    placeMarks(o);
    if (mode === 'wide') {
      ['width', 'top', 'left'].forEach(prop => { card.style[prop] = ''; });
      card.classList.remove('opening');
      return;
    }
    // a narrow window: the closed column sits just left of the page's text; a phone: in its gutter
    // the slim closed column (course.css): 12 px left of the page's text where there is room, else in the
    // page's 32 px gutter, 2 px from the screen's edge
    const shut = 26;
    let left = 2;
    if (content) {
      const box = content.getBoundingClientRect();
      left = Math.max(2, box.left / rectScale() + parseFloat(getComputedStyle(content).paddingLeft) - 12 - shut);
    }
    card.style.left = `${left}px`;
    const wide = Math.min(310, pageWidth() - left - 10);
    card.style.width = `${shut + (wide - shut) * ease(p)}px`;
    // The row the card opens around is chosen while it is closed and then held, so scrolling with the
    // card open changes what is marked on it, never where it sits.
    const total = o[o.length - 1].top + 2 * PADV;
    if (p === 0 || anchorY === null) {
      anchorRow = Math.max(0, rows.indexOf(cur || headRow));
      // closed, it sits where a wide window's sidebar does, at the top; on a phone's touch screen a
      // little below the middle, where a thumb reaches it
      const closed = offsets(0);
      const top0 = mode === 'phone' && touch.matches ? windowHeight() * 0.55 - (closed[closed.length - 1].top + 2 * PADV) / 2 : TOP;
      anchorY = top0 + PADV + closed[anchorRow].mid;
    }
    const top = anchorY - PADV - o[anchorRow].mid;
    card.style.top = `${Math.max(8, Math.min(windowHeight() - total - 8, top))}px`;
    card.classList.toggle('opening', p > 0);
  }

  function animate(to) {
    target = to;
    hideTip();
    cancelAnimationFrame(anim);
    scrim.hidden = to === 0;
    card.classList.toggle('is-open', to === 1);
    if (reduceMotion.matches) { p = to; layout(); return; }
    const from = p, start = performance.now(), duration = 300;
    const step = now => {
      const k = Math.min(1, (now - start) / duration);
      p = from + (to - from) * ease(k);
      layout();
      if (k < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }
  const close = () => { if (target === 1) animate(0); };

  function measure() {
    const previous = mode;
    const width = pageWidth();
    mode = width >= WIDE ? 'wide' : width > 650 ? 'narrow' : 'phone';
    ['wide', 'narrow', 'phone'].forEach(name => root.classList.toggle(`cc-${name}`, name === mode));
    if (previous !== mode) { p = 0; target = 0; scrim.hidden = true; card.classList.remove('is-open'); anchorY = null; }
    mineRows.forEach(row => { row.yd = row === headRow ? 0 : row.el ? row.el.getBoundingClientRect().top + scrollY : undefined; });
    paint();
  }
  // The block on screen is the last of this page's sections to have passed 30% of the way down.
  function paint() {
    frame = 0;
    const line = scrollY + innerHeight * 0.3;
    cur = null;
    mineRows.forEach(row => { if (row !== headRow && row.yd !== undefined && row.yd <= line) cur = row; });
    // this page's rows whose sections are on screen
    const shown = new Set();
    const measured = mineRows.filter(row => row !== headRow && row.yd !== undefined);
    measured.forEach((row, k) => {
      const end = k + 1 < measured.length ? measured[k + 1].yd : root.scrollHeight;
      if (row.yd < scrollY + innerHeight && end > scrollY) shown.add(row);
    });
    rows.forEach(row => {
      row.node.classList.toggle('cc-in', shown.has(row));
      row.node.classList.toggle('cc-cur', row === cur);
      row.node.classList.toggle('hot', row === hot);
    });
    layout();
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };

  // Names at once under a pointer (a title attribute waits too long): every row of a closed column,
  // toward the page; open or wide, the faint dashes, which have no names of their own showing.
  function showTip(row) {
    const closed = mode !== 'wide' && target === 0;
    if (!row.tip || down || (!closed && row.kind !== 'faint')) return;
    const glyph = row.node.querySelector('.cc-g').getBoundingClientRect();
    const box = card.getBoundingClientRect();
    const k = rectScale();
    tip.textContent = row.tip;
    tip.classList.add('vis');
    tip.style.top = `${(glyph.top + glyph.height / 2) / k}px`;
    const toLeft = !closed && mode === 'wide';   // a wide window's names sit left of the column
    if (toLeft) { tip.style.left = 'auto'; tip.style.right = `${pageWidth() - glyph.left / k + 6}px`; }
    else { tip.style.right = 'auto'; tip.style.left = `${(closed ? box.right : glyph.right) / k + 6}px`; }
  }
  function hideTip() { tip.classList.remove('vis'); }
  rows.forEach(row => {
    row.node.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') showTip(row); });
    row.node.addEventListener('pointerleave', hideTip);
    row.node.addEventListener('click', event => {
      if (swallowClick) { event.preventDefault(); return; }
      // a closed column acts on release (a key press still follows the link)
      if (mode !== 'wide' && target === 0 && event.detail !== 0) { event.preventDefault(); return; }
      if (row.kind === 'start' || (row.kind === 'end' && !row.href && !row.el)) { event.preventDefault(); return; }
      if (row.href) return;   // another part, its blocks, or the course page: an ordinary link
      event.preventDefault();
      scrollToRow(row);
    });
  });
  function scrollToRow(row) {
    const top = row === headRow || !row.el ? 0 : Math.max(0, row.el.getBoundingClientRect().top + scrollY - 24 * rectScale());
    window.scrollTo({ top, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    close();
  }
  // what a mouse click on the closed column follows without opening it: the rows it names on sight
  const direct = row => row.kind === 'home' || row.kind === 'part' || (row.mine && (row.kind === 'block' || row.kind === 'cp'));
  scrim.addEventListener('click', close);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });

  // A press on the closed column: a tap opens it; a slide moves through this page, and onto another
  // part (or one of its blocks) offers to open it on release.
  const rowAt = y => { const o = offsets(p); let best = rows[0]; rows.forEach((row, i) => { if (y >= o[i].top) best = row; }); return best; };
  const midOf = row => offsets(p)[rows.indexOf(row)].mid;
  const localY = event => (event.clientY - card.getBoundingClientRect().top) / rectScale() - PADV;
  function showBubble(row, title, sub, opens) {
    const box = card.getBoundingClientRect();
    bubble.classList.add('vis');
    bubble.classList.toggle('opens', opens);
    const k = rectScale();
    bubble.style.top = `${box.top / k + PADV + midOf(row)}px`;
    bubble.style.left = `${box.right / k + 8}px`;
    bubbleTitle.textContent = title;
    bubbleSub.textContent = sub;
  }
  card.addEventListener('pointerdown', event => {
    if (mode === 'wide' || target === 1) return;
    try { card.setPointerCapture(event.pointerId); } catch (error) { /* already released */ }
    down = { y: localY(event), moved: false, mouse: event.pointerType === 'mouse' };
    hot = rowAt(down.y);
    hideTip();
    schedule();
  });
  card.addEventListener('pointermove', event => {
    if (mode === 'wide' || target === 1) return;
    const y = localY(event);
    if (!down) { const row = rowAt(y); if (row !== hot) { hot = row; schedule(); } return; }
    if (Math.abs(y - down.y) > 6) down.moved = true;
    if (!down.moved) return;
    const row = rowAt(y);
    hot = row;
    if (row.mine) {
      pending = null;
      let k = 0;
      while (k + 1 < mineRows.length && midOf(mineRows[k + 1]) <= y) k += 1;
      const from = mineRows[k], next = mineRows[k + 1];
      const fromY = from.yd || 0;
      const nextY = next && next.yd !== undefined ? next.yd : Math.max(fromY + 1, root.scrollHeight - innerHeight);
      const t = Math.min(1, Math.max(0, (y - midOf(from)) / (next ? midOf(next) - midOf(from) : 12)));
      window.scrollTo({ top: Math.max(0, fromY + t * (nextY - fromY) - innerHeight * 0.3 + 1), behavior: 'auto' });
      const shown = mineRows[t > 0.5 && next ? k + 1 : k];
      showBubble(row, shown === headRow ? (headRow.kind === 'home' ? headRow.tip : headRow.node.dataset.tip || '') : shown.tip, shown === headRow ? 'top of the page' : '', false);
    } else if (row.href) {
      pending = row.href;
      showBubble(row, row.tip, 'let go to open →', true);
    } else {
      pending = null;
      bubble.classList.remove('vis');
    }
    schedule();
  });
  const release = event => {
    const pressed = down;
    down = null;
    bubble.classList.remove('vis');
    if (!pressed) return;
    if (pressed.moved && pending) { location.href = pending; return; }
    if (!pressed.moved) {
      swallowClick = true;
      setTimeout(() => { swallowClick = false; }, 60);
      const row = rowAt(pressed.y);
      if (pressed.mouse && event.type === 'pointerup' && direct(row)) {
        if (!row.href) scrollToRow(row);
        else if (event.metaKey || event.ctrlKey) window.open(row.href, '_blank', 'noopener');
        else location.href = row.href;
      } else animate(1);
    }
    pending = null;
    hot = null;
    schedule();
  };
  card.addEventListener('pointerup', release);
  card.addEventListener('pointercancel', release);
  card.addEventListener('pointerleave', () => { if (!down && hot) { hot = null; schedule(); } });

  window.addEventListener('scroll', () => { hideTip(); schedule(); }, { passive: true });
  window.addEventListener('resize', measure);
  if (window.ResizeObserver) new ResizeObserver(() => measure()).observe(document.body);
  measure();
  return true;
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
  document.querySelectorAll('.path-step[data-date], .bc-step[data-date]').forEach(step => {
    if (step.dataset.date < today) step.classList.add('past');
  });
}
