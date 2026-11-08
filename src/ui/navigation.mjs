export function initNavigation(doc = globalThis.document, win = globalThis.window) {
  if (!doc || !win) return;
  const toggle = doc.getElementById('menu-toggle');
  const menu = doc.getElementById('mobile-menu');
  const progressBar = doc.getElementById('page-progress-bar');
  const backToTop = doc.getElementById('back-to-top');
  const header = doc.querySelector('.site-header');
  const navLinks = [...doc.querySelectorAll('[data-section-link]')];
  const sections = [...doc.querySelectorAll('main > section')];
  const menuBreakpoint = win.matchMedia('(max-width: 900px)');
  let framePending = false;

  if (toggle && menu) {
    toggle.hidden = false;
    const setMenu = open => {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      toggle.classList.toggle('is-open', open);
      doc.body.classList.toggle('menu-open', open);
    };

    toggle.addEventListener('click', () => {
      const open = menu.hidden;
      setMenu(open);
      if (open) menu.querySelector('a')?.focus();
    });

    for (const link of menu.querySelectorAll('[data-mobile-link]')) {
      link.addEventListener('click', () => {
        const target = doc.getElementById(link.dataset.sectionLink);
        setMenu(false);
        if (!target) return;
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      });
    }

    doc.addEventListener('keydown', event => {
      if (menu.hidden || event.key !== 'Escape') return;
      event.preventDefault();
      setMenu(false);
      toggle.focus();
    });
    doc.addEventListener('focusin', event => {
      if (!menu.hidden && event.target !== toggle && !menu.contains(event.target)) setMenu(false);
    });
    doc.addEventListener('pointerdown', event => {
      if (!menu.hidden && !toggle.contains(event.target) && !menu.contains(event.target)) setMenu(false);
    });
    menuBreakpoint.addEventListener('change', () => {
      if (!menuBreakpoint.matches && !menu.hidden) setMenu(false);
    });
    win.addEventListener('hashchange', () => setMenu(false));
  }

  function updateScrollState() {
    framePending = false;
    const root = doc.documentElement;
    const max = root.scrollHeight - win.innerHeight;
    const scrolled = Math.max(0, win.scrollY);
    if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrolled / max) : 0})`;
    header?.classList.toggle('has-scrolled', scrolled > 28);
    if (backToTop) backToTop.hidden = scrolled <= 650;

    let active = '';
    const boundary = Math.min(230, win.innerHeight * .30);
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= boundary) active = section.id;
    }
    for (const link of navLinks) {
      const current = link.dataset.sectionLink === active;
      link.classList.toggle('is-current', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  function scheduleUpdate() {
    if (framePending) return;
    framePending = true;
    win.requestAnimationFrame(updateScrollState);
  }
  win.addEventListener('scroll', scheduleUpdate, { passive: true });
  win.addEventListener('resize', scheduleUpdate, { passive: true });
  scheduleUpdate();

  if (!win.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in win) {
    const observer = new win.IntersectionObserver((entries, instance) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        instance.unobserve(entry.target);
      }
    }, { threshold: .12 });
    doc.querySelectorAll('.section-header').forEach(element => observer.observe(element));
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initNavigation());
  else initNavigation();
}
