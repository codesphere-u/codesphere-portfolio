/**
 * Progressive enhancement for the engineering portfolio.
 * No tracking, third-party libraries, or dependence on an animation framework.
 * The application stays fully usable with JavaScript or motion disabled.
 */
export function initMotionSystem() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const reducedMotion = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

  // Lightweight reading progress bar. Decorative only, never steals focus.
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);

  // A genuine control, keyboard reachable and useful on long engineering pages.
  const topButton = document.createElement('button');
  topButton.type = 'button';
  topButton.className = 'back-to-top';
  topButton.textContent = '↑';
  topButton.setAttribute('aria-label', 'Back to the beginning of the portfolio');
  topButton.setAttribute('title', 'Back to top');
  topButton.tabIndex = -1;
  topButton.setAttribute('aria-hidden', 'true');
  document.body.append(topButton);
  topButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  let ticking = false;
  const updateScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const root = document.documentElement;
      const available = Math.max(1, root.scrollHeight - window.innerHeight);
      const fraction = Math.max(0, Math.min(1, window.scrollY / available));
      progress.style.transform = `scaleX(${fraction})`;
      const buttonVisible = window.scrollY > 560;
      topButton.classList.toggle('is-visible', buttonVisible);
      topButton.tabIndex = buttonVisible ? 0 : -1;
      topButton.setAttribute('aria-hidden', buttonVisible ? 'false' : 'true');
      ticking = false;
    });
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  if (reducedMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, activeObserver) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      activeObserver.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -32px 0px', threshold: 0.06 });

  function registerReveals(root = document) {
    const selectors = '.section-header, .journey-stage, .experience-card, .about-narrative-card, .education-card, .telemetry-card, .project-card';
    for (const node of root.querySelectorAll(selectors)) {
      if (node.classList.contains('will-reveal')) continue;
      node.classList.add('will-reveal');
      observer.observe(node);
    }
  }

  registerReveals();

  // Project filtering creates cards dynamically; keep those transitions fresh.
  const projectGrid = document.getElementById('projects-grid');
  if (projectGrid && 'MutationObserver' in window) {
    const mutations = new MutationObserver(() => registerReveals(projectGrid));
    mutations.observe(projectGrid, { childList: true });
  }

  // Subtle pointer-responsive light on project cards only for precise pointers.
  if (window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('pointermove', (event) => {
      const element = event.target instanceof Element ? event.target : null;
      const card = element?.closest('.project-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
    }, { passive: true });
  }
}
