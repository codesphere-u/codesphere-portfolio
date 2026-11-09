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
