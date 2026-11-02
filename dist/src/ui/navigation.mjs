/**
 * Portfolio navigation layer.
 * Progressive enhancement: all content and links work without JavaScript.
 * No third-party dependencies or tracking.
 */
export function initNavigation(doc = globalThis.document, win = globalThis.window) {
  if (!doc || !win) return;
  const toggle = doc.getElementById('menu-toggle');
  const menu = doc.getElementById('mobile-menu');
  const progressBar = doc.getElementById('page-progress-bar');
  const backToTop = doc.getElementById('back-to-top');
  const header = doc.querySelector('.site-header');
  const sectionIds = ['projects','journey','mindmap','terminal','philosophy','about','experience','broader-archive','benchmarks-matrix','contact'];
  const sections = sectionIds.map(id => doc.getElementById(id)).filter(Boolean);
  const navLinks = [...doc.querySelectorAll('[data-section-link]')];
  const reducedMotion = win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  let menuIsOpen = false;
  let previousFocus = null;
  let rafScheduled = false;

  const menuFocusable = () => [...menu.querySelectorAll('a[href],button:not([disabled])')].filter(el => el.getClientRects().length > 0);

  function setMenu(open, restoreFocus = false) {
    if (!menu || !toggle) return;
    menuIsOpen = Boolean(open);
    menu.hidden = !menuIsOpen;
    toggle.setAttribute('aria-expanded', String(menuIsOpen));
    toggle.setAttribute('aria-label', menuIsOpen ? 'Close navigation menu' : 'Open navigation menu');
    toggle.classList.toggle('is-open', menuIsOpen);
    doc.body.classList.toggle('menu-open', menuIsOpen);
    if (menuIsOpen) {
      previousFocus = doc.activeElement;
      menuFocusable()[0]?.focus();
    } else if (restoreFocus) {
      (previousFocus || toggle).focus?.();
    }
  }

  toggle?.addEventListener('click', () => setMenu(!menuIsOpen, menuIsOpen));
  menu?.querySelectorAll('[data-mobile-link]').forEach(link => link.addEventListener('click', () => setMenu(false)));
  win.addEventListener('hashchange', () => setMenu(false));

  doc.addEventListener('keydown', event => {
    if (!menuIsOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenu(false, true);
      return;
    }
    if (event.key === 'Tab') {
      const targets = [...menuFocusable(), toggle].filter(Boolean);
      if (!targets.length) return;
      const first = targets[0], last = targets[targets.length - 1];
      if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  doc.addEventListener('pointerdown', event => {
    if (menuIsOpen && !menu.contains(event.target) && !toggle?.contains(event.target)) setMenu(false);
  });
  win.addEventListener('resize', () => {
    if (win.innerWidth > 900 && menuIsOpen) setMenu(false);
    scheduleUpdate();
  }, {passive:true});

  function updateScrollState() {
    rafScheduled = false;
    const root = doc.documentElement;
    const max = Math.max(0, root.scrollHeight - win.innerHeight);
    const scrolled = Math.max(0, win.scrollY || root.scrollTop || 0);
    const pct = max === 0 ? 0 : Math.min(100, Math.max(0, scrolled / max * 100));
    if (progressBar) progressBar.style.width = pct.toFixed(2) + '%';
    if (header) header.classList.toggle('has-scrolled', scrolled > 28);
    if (backToTop) backToTop.classList.toggle('is-visible', scrolled > 650);
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
    if (rafScheduled) return;
    rafScheduled = true;
    win.requestAnimationFrame?.(updateScrollState) ?? updateScrollState();
  }
  win.addEventListener('scroll', scheduleUpdate, { passive: true });
  scheduleUpdate();

  // Subtle, one-time reveal—only for users who accept motion.
  if (!reducedMotion && 'IntersectionObserver' in win) {
    const targets = [...doc.querySelectorAll('.section-header, .featured-work, .project-card, .experience-card')];
    const observer = new win.IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); obs.unobserve(entry.target); }
      }
    }, {threshold:0.04, rootMargin:'0px 0px -24px 0px'});
    targets.forEach(el => {el.classList.add('is-reveal-ready');observer.observe(el);});
  }
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initNavigation());
  else initNavigation();
}
