const header = document.querySelector('[data-site-header]');
const nav = header.querySelector('nav');
const button = header.querySelector('.nav-toggle');
const projects = header.querySelector('.project-disclosure');
const projectToggle = projects.querySelector('summary');
const compact = matchMedia('(max-width: 760px)');

function setCompactMenu(open) {
  button.setAttribute('aria-expanded', String(open));
  nav.hidden = compact.matches && !open;
  if (!open) projects.open = false;
}

function syncLayout() {
  const focusWasInNav = nav.contains(document.activeElement);
  const focusWasOnToggle = document.activeElement === button;
  button.hidden = !compact.matches;
  setCompactMenu(false);
  if (compact.matches && focusWasInNav) button.focus();
  if (!compact.matches && focusWasOnToggle) nav.querySelector('a').focus();
}

button.addEventListener('click', () => {
  setCompactMenu(button.getAttribute('aria-expanded') !== 'true');
});
compact.addEventListener('change', syncLayout);

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !header.contains(document.activeElement)) return;
  if (projects.open) {
    event.preventDefault();
    projects.open = false;
    projectToggle.focus();
  } else if (compact.matches && !nav.hidden) {
    event.preventDefault();
    setCompactMenu(false);
    button.focus();
  }
});

document.addEventListener('pointerdown', event => {
  if (!header.contains(event.target) && compact.matches && !nav.hidden) {
    setCompactMenu(false);
  } else if (!projects.contains(event.target)) {
    projects.open = false;
  }
});

document.addEventListener('focusin', event => {
  if (!header.contains(event.target) && compact.matches && !nav.hidden) {
    setCompactMenu(false);
  } else if (!projects.contains(event.target)) {
    projects.open = false;
  }
});

addEventListener('pagehide', () => setCompactMenu(false));
syncLayout();

const readingLine = header.querySelector('.reading-line');
let scrollFrame;

function updateReadingPosition() {
  scrollFrame = undefined;
  const pageHeight = document.documentElement.scrollHeight - innerHeight;
  const offset = Math.max(0, scrollY);
  const progress = pageHeight > 0 ? Math.min(1, offset / pageHeight) : 0;
  header.classList.toggle('is-docked', offset > 48);
  readingLine.style.setProperty('--reading-progress', progress.toFixed(4));
}

function scheduleReadingUpdate() {
  if (scrollFrame === undefined) scrollFrame = requestAnimationFrame(updateReadingPosition);
}

addEventListener('scroll', scheduleReadingUpdate, { passive: true });
addEventListener('resize', scheduleReadingUpdate, { passive: true });
addEventListener('pageshow', scheduleReadingUpdate);
scheduleReadingUpdate();

const motion = matchMedia('(prefers-reduced-motion: no-preference)');
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
