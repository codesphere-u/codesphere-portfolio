import { motion as motionQuery, sortHeadings } from './motion.mjs';

const header = document.querySelector('[data-site-header]');
const nav = header.querySelector('nav');
const button = header.querySelector('.nav-toggle');
const orb = header.querySelector('.nav-orb');
const orbCore = orb.querySelector('.nav-orb-core');
const projects = header.querySelector('.project-disclosure');
const projectToggle = projects.querySelector('summary');
const compact = matchMedia('(max-width: 760px)');
const motion = matchMedia('(prefers-reduced-motion: no-preference)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

// Scroll offsets (px): the bar docks into a pill, condenses into the orb, and (with some
// hysteresis so it never flickers) opens back into the bar near the top of the page.
const DOCK_AT = 48;
const ORB_AT = 220;
const BAR_AT = 140;

let orbMode = false;
let open = false;
let closing;

const navItems = () => [...nav.querySelectorAll('.nav-pages > li')];
const barItems = () => [button, ...navItems()].filter(element => element.getClientRects().length > 0);

function centerOf(element) {
  const box = element.getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2, r: box.width / 2 };
}

function settle(elements) {
  for (const element of elements) {
    for (const animation of element.getAnimations()) animation.cancel();
  }
}

// Nearest items first, so the bar folds into the orb from its right end outward.
function byDistance(elements, target) {
  return elements
    .map(element => {
      const point = centerOf(element);
      return { element, dx: target.x - point.x, dy: target.y - point.y };
    })
    .sort((a, b) => Math.hypot(a.dx, a.dy) - Math.hypot(b.dx, b.dy));
}

// The links show as a card when the menu is open from the orb, or from the Menu island on small screens.
function syncCard() {
  const showing = open || header.classList.contains('is-closing');
  header.classList.toggle('is-card', showing && (orbMode || compact.matches));
}

function render() {
  header.classList.toggle('is-orb', orbMode);
  header.classList.toggle('is-open', open);
  syncCard();
  for (const toggle of [button, orb]) toggle.setAttribute('aria-expanded', String(open));
  orb.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.hidden = !orbMode && compact.matches && !open;
  button.inert = orbMode;
  orb.inert = !orbMode;
  nav.inert = orbMode && !open;
  if (!open) projects.open = false;
}

function collapseToOrb(animate) {
  settle([...barItems(), orbCore]);
  const moves = animate && motion.matches ? byDistance(barItems(), centerOf(orb)) : [];
  orbMode = true;
  open = false;
  render();
  placeHighlight(null);
  if (!moves.length) return;

  // Each item winds up a touch, then is pulled into the orb.
  moves.forEach(({ element, dx, dy }, index) => {
    element.animate([
      { visibility: 'visible', opacity: 1, transform: 'none', filter: 'blur(0)' },
      { visibility: 'visible', opacity: 1, transform: `translate(${dx * -0.05}px, ${dy * -0.05}px) scale(1.04)`, offset: 0.3 },
      { visibility: 'visible', opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(0.1)`, filter: 'blur(4px)' }
    ], { duration: 480, delay: index * 40, easing: 'cubic-bezier(.6,0,.75,.3)', fill: 'backwards' });
  });
  orbCore.animate([
    { transform: 'scale(0) rotate(-140deg)' },
    { transform: 'scale(1.16) rotate(10deg)', offset: 0.68 },
    { transform: 'none' }
  ], { duration: 560, delay: 300, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' });
}

function expandToBar(animate) {
  closeMenu({ instant: true });
  settle([...barItems(), orbCore]);
  const target = centerOf(orb);
  orbMode = false;
  render();
  restHighlight();
  if (!animate || !motion.matches) return;

  orbCore.animate([
    { visibility: 'visible', opacity: 1, transform: 'none' },
    { visibility: 'visible', opacity: 0, transform: 'scale(0) rotate(120deg)' }
  ], { duration: 280, easing: 'cubic-bezier(.5,0,.75,0)' });
  byDistance(barItems(), target).forEach(({ element, dx, dy }, index) => {
    element.animate([
      { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(0.1)`, filter: 'blur(4px)' },
      { opacity: 1, transform: 'none', filter: 'blur(0)' }
    ], { duration: 620, delay: 140 + index * 45, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
  });
}

function cardGeometry() {
  const origin = centerOf(orb);
  const card = nav.getBoundingClientRect();
  const x = origin.x - card.left;
  const y = origin.y - card.top;
  const reach = Math.hypot(Math.max(x, card.width - x), Math.max(y, card.height - y));
  return { origin, x, y, reach };
}

function finishClosing() {
  if (!closing) return;
  closing.onfinish = null;
  closing.cancel();
  closing = undefined;
  header.classList.remove('is-closing');
  syncCard();
  settle(navItems());
  restHighlight();
}

function openMenu() {
  finishClosing();
  settle([nav, ...navItems()]);
  open = true;
  render();
  if (!orbMode || !motion.matches) return;

  // The card pours out of the orb, and the links spill out after it.
  const { origin, x, y, reach } = cardGeometry();
  nav.animate([
    { clipPath: `circle(${origin.r}px at ${x}px ${y}px)` },
    { clipPath: `circle(${reach}px at ${x}px ${y}px)` }
  ], { duration: 640, easing: 'cubic-bezier(.7,0,.15,1)' });
  navItems().forEach((item, index) => {
    const point = centerOf(item);
    item.animate([
      {
        opacity: 0,
        transform: `translate(${(origin.x - point.x) * 0.45}px, ${(origin.y - point.y) * 0.45}px) scale(0.55) rotate(-5deg)`,
        filter: 'blur(6px)'
      },
      { opacity: 1, transform: 'none', filter: 'blur(0)' }
    ], { duration: 700, delay: 110 + index * 55, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
  });
}

function closeMenu({ instant = false } = {}) {
  if (!open) {
    if (instant) finishClosing();
    return;
  }
  const animateOut = !instant && orbMode && motion.matches;
  const geometry = animateOut ? cardGeometry() : undefined;
  open = false;
  if (animateOut) header.classList.add('is-closing');
  render();
  if (!animateOut) return;

  settle([nav, ...navItems()]);
  const { origin, x, y, reach } = geometry;
  for (const item of navItems()) {
    item.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-6px) scale(.97)' }], {
      duration: 200, easing: 'ease-in', fill: 'forwards'
    });
  }
  closing = nav.animate([
    { clipPath: `circle(${reach}px at ${x}px ${y}px)` },
    { clipPath: `circle(${origin.r}px at ${x}px ${y}px)` }
  ], { duration: 460, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
  closing.onfinish = finishClosing;
}

// The dock's highlight rests on the current page and slides to whatever is hovered or focused.
const pages = nav.querySelector('.nav-pages');
const dockItem = target => target?.closest('.nav-pages > li:not(.nav-contact)');

function placeHighlight(item) {
  if (!item || header.classList.contains('is-card') || orbMode) {
    pages.style.setProperty('--hl-o', '0');
    return;
  }
  pages.style.setProperty('--hl-x', `${item.offsetLeft}px`);
  pages.style.setProperty('--hl-w', `${item.offsetWidth}px`);
  pages.style.setProperty('--hl-o', '1');
}

function restHighlight() {
  placeHighlight(dockItem(pages.querySelector(':scope > li > a:is([aria-current], [data-active-section])')));
}

pages.addEventListener('pointerover', event => {
  const item = dockItem(event.target);
  if (item) placeHighlight(item);
});
pages.addEventListener('pointerleave', restHighlight);
pages.addEventListener('focusin', event => {
  const item = dockItem(event.target);
  if (item) placeHighlight(item);
  else restHighlight();
});
pages.addEventListener('focusout', event => {
  if (!pages.contains(event.relatedTarget)) restHighlight();
});
addEventListener('resize', restHighlight, { passive: true });
document.fonts?.ready.then(restHighlight);

function syncLayout() {
  const focusWasInNav = nav.contains(document.activeElement);
  const focusWasOnToggle = document.activeElement === button;
  button.hidden = !compact.matches;
  closeMenu({ instant: true });
  render();
  if (orbMode) return;
  if (compact.matches && focusWasInNav) button.focus();
  if (!compact.matches && focusWasOnToggle) nav.querySelector('a').focus();
}

button.addEventListener('click', () => (open ? closeMenu() : openMenu()));
orb.addEventListener('click', () => (open ? closeMenu() : openMenu()));
compact.addEventListener('change', syncLayout);

// A gentle magnetic pull toward the pointer on devices that can hover.
orb.addEventListener('pointermove', event => {
  if (!finePointer.matches || !motion.matches) return;
  const { x, y } = centerOf(orb);
  orbCore.style.translate = `${(event.clientX - x) * 0.3}px ${(event.clientY - y) * 0.3}px`;
});
orb.addEventListener('pointerleave', () => {
  orbCore.style.translate = '';
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !header.contains(document.activeElement)) return;
  if (projects.open) {
    event.preventDefault();
    projects.open = false;
    projectToggle.focus();
  } else if (open) {
    event.preventDefault();
    closeMenu();
    (orbMode ? orb : button).focus();
  }
});

document.addEventListener('pointerdown', event => {
  if (open && !header.contains(event.target)) {
    closeMenu();
  } else if (!projects.contains(event.target)) {
    projects.open = false;
  }
});

document.addEventListener('focusin', event => {
  if (open && !header.contains(event.target)) {
    closeMenu();
  } else if (!projects.contains(event.target)) {
    projects.open = false;
  }
});

addEventListener('pagehide', () => closeMenu({ instant: true }));
syncLayout();
restHighlight();

let scrollFrame;
let primed = false;

function updateScrollState() {
  scrollFrame = undefined;
  const pageHeight = document.documentElement.scrollHeight - innerHeight;
  const offset = Math.max(0, scrollY);
  const progress = pageHeight > 0 ? Math.min(1, offset / pageHeight) : 0;
  if (!orbMode && offset > ORB_AT) collapseToOrb(primed);
  else if (orbMode && offset < BAR_AT) expandToBar(primed);
  header.classList.toggle('is-docked', orbMode || offset > DOCK_AT);
  header.style.setProperty('--reading-progress', progress.toFixed(4));
  primed = true;
}

function scheduleScrollUpdate() {
  if (scrollFrame === undefined) scrollFrame = requestAnimationFrame(updateScrollState);
}

addEventListener('scroll', scheduleScrollUpdate, { passive: true });
addEventListener('resize', scheduleScrollUpdate, { passive: true });
addEventListener('pageshow', scheduleScrollUpdate);
scheduleScrollUpdate();

let reveals;

function observeReveals() {
  reveals?.disconnect();
  if (!motion.matches || !('IntersectionObserver' in window)) return;

  reveals = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      entry.target.classList.add('is-revealed');
    }
  }, { threshold: 0.05, rootMargin: '0px 0px -34px 0px' });

  for (const element of document.querySelectorAll('[data-scroll-reveal]:not(.is-revealed)')) {
    reveals.observe(element);
  }
}

motion.addEventListener('change', observeReveals);
observeReveals();

// ---------- Page-wide touches ----------

sortHeadings();

// Live local time wherever the page shows it.
const kampala = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Kampala', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const clocks = document.querySelectorAll('[data-local-time]');
if (clocks.length) {
  const tick = () => clocks.forEach(clock => { clock.textContent = `${kampala.format(new Date())} EAT`; });
  tick();
  setInterval(tick, 15000);
}

// Work index: domain filters, and a preview card that follows the pointer.
const index = document.querySelector('[data-work-index]');
if (index) {
  const filters = document.querySelector('[data-index-filters]');
  const empty = document.querySelector('[data-index-empty]');
  const rows = [...index.children];
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    const domain = button.dataset.filter;
    for (const other of filters.querySelectorAll('button[data-filter]')) other.setAttribute('aria-pressed', String(other === button));
    let shown = 0;
    rows.forEach(row => {
      const match = !domain || row.dataset.domains.split(' ').includes(domain);
      row.hidden = !match;
      row.classList.remove('is-filtered-in');
      if (match) {
        void row.offsetWidth;
        row.classList.add('is-filtered-in');
        row.style.animationDelay = `${shown * 40}ms`;
        shown += 1;
      }
    });
    empty.hidden = shown > 0;
  });
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    index.toggleAttribute('data-live', true);
    index.addEventListener('pointermove', event => {
      index.style.setProperty('--px', `${Math.min(event.clientX, innerWidth - 330)}px`);
      index.style.setProperty('--py', `${Math.min(event.clientY, innerHeight - 190)}px`);
    }, { passive: true });
  }
}

// Case studies: the rail marks the chapter being read and shows how far through the story you are.
const rail = document.querySelector('[data-case-rail]');
if (rail) {
  const story = document.querySelector('[data-case-story]');
  const links = [...rail.querySelectorAll('a')];
  const chapters = links.map(link => document.querySelector(link.getAttribute('href')).closest('section'));
  let railFrame;
  const update = () => {
    railFrame = undefined;
    const box = story.getBoundingClientRect();
    const read = Math.min(1, Math.max(0, (innerHeight * 0.4 - box.top) / box.height));
    rail.style.setProperty('--read', read.toFixed(3));
    let current = 0;
    chapters.forEach((chapter, position) => {
      if (chapter.getBoundingClientRect().top < innerHeight * 0.45) current = position;
    });
    links.forEach((link, position) => {
      if (position === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };
  const schedule = () => { if (railFrame === undefined) railFrame = requestAnimationFrame(update); };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  update();
}

// Footer wordmark: the pointer paints it in gold as it passes, and it drains away on leave.
const wordmark = document.querySelector('.footer-wordmark');
if (wordmark && motionQuery.matches) {
  wordmark.addEventListener('pointermove', event => {
    const box = wordmark.getBoundingClientRect();
    wordmark.style.setProperty('--fill', `${Math.round(((event.clientX - box.left) / box.width) * 100)}%`);
  });
  wordmark.addEventListener('pointerleave', () => wordmark.style.setProperty('--fill', '0%'));
}
