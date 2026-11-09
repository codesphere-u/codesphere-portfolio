// "The Exhibition": pins the selected work on large screens and runs each project's demo
// when its chapter arrives. Scrolling stays native: the page only reads the scroll position.
const motion = matchMedia('(prefers-reduced-motion: no-preference)');
const roomy = matchMedia('(min-width: 981px) and (min-height: 660px)');
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const smooth = t => t * t * (3 - 2 * t);

// Turns a [data-switcher] block into tabs with a sliding pill. onSelect(index, panel, byUser).
function enhanceSwitcher(root, onSelect = () => {}) {
  const controls = root.querySelector(':scope > [data-switcher-controls]');
  const tabs = [...controls.querySelectorAll('button')];
  const panels = [...root.querySelectorAll(':scope > [data-switcher-panel]')];
  let current = 0;
  controls.setAttribute('role', 'tablist');

  function placePill() {
    const tab = tabs[current];
    controls.style.setProperty('--pill-x', `${tab.offsetLeft}px`);
    controls.style.setProperty('--pill-w', `${tab.offsetWidth}px`);
  }

  function select(index, { focus = false, byUser = false, silent = false } = {}) {
    current = index;
    tabs.forEach((tab, position) => {
      const active = position === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[position].hidden = !active;
    });
    placePill();
    if (focus) tabs[index].focus();
    if (!silent) onSelect(index, panels[index], byUser);
  }

  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
    tab.addEventListener('click', () => select(index, { byUser: true }));
    tab.addEventListener('keydown', event => {
      const last = tabs.length - 1;
      const destinations = { ArrowLeft: index === 0 ? last : index - 1, ArrowRight: index === last ? 0 : index + 1, Home: 0, End: last };
      if (!Object.hasOwn(destinations, event.key)) return;
      event.preventDefault();
      select(destinations[event.key], { focus: true, byUser: true });
    });
  });

  controls.hidden = false;
  root.dataset.enhanced = '';
  select(0, { silent: true });
  addEventListener('resize', placePill, { passive: true });
  return { select, placePill, get current() { return current; }, count: tabs.length };
}

// Timers that belong to one running demo, cleared when it restarts.
function timeline() {
  const timers = [];
  return {
    at(ms, fn) { timers.push(setTimeout(fn, ms)); },
    clear() { timers.splice(0).forEach(clearTimeout); }
  };
}

function countTo(element, target, duration) {
  const start = performance.now();
  const tick = now => {
    const progress = clamp((now - start) / duration, 0, 1);
    element.textContent = String(Math.round(target * (1 - (1 - progress) ** 4)));
    if (progress < 1 && element.isConnected) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const demos = {
  // Steps through the screenshots on its own until the visitor takes over.
  'funa-gigs'(chapter) {
    let auto;
    let touched = false;
    const stop = () => clearInterval(auto);
    const switcher = enhanceSwitcher(chapter.querySelector('[data-switcher]'), (_, __, byUser) => {
      if (byUser) { touched = true; stop(); }
    });
    chapter.querySelector('[data-switcher]').addEventListener('pointerenter', () => { touched = true; stop(); });
    return {
      switcher,
      enter() {
        switcher.placePill();
        if (!motion.matches || touched) return;
        stop();
        auto = setInterval(() => switcher.select((switcher.current + 1) % switcher.count), 3800);
      },
      leave: stop
    };
  },

  // Sweeps the message, lights each signal where it appears, then fills the gauge.
  'cyber-dragon'(chapter) {
    const runs = timeline();
    const play = panel => {
      runs.clear();
      if (!motion.matches) return;
      const result = panel.querySelector('[data-scan]');
      const marks = [...result.querySelectorAll('mark')];
      const chips = [...result.querySelectorAll('.scan-signals li')];
      const score = result.querySelector('[data-score]');
      result.classList.remove('is-scanning', 'is-scored');
      for (const element of [...marks, ...chips]) element.classList.remove('is-lit');
      result.classList.add('is-armed');
      score.textContent = '0';
      void result.offsetWidth;
      result.classList.add('is-scanning');
      marks.forEach((mark, index) => runs.at(320 + index * 190, () => {
        mark.classList.add('is-lit');
        chips.find(chip => chip.dataset.signal === mark.dataset.signal)?.classList.add('is-lit');
      }));
      if (!marks.length) runs.at(700, () => chips.forEach(chip => chip.classList.add('is-lit')));
      runs.at(980, () => {
        result.classList.add('is-scored');
        countTo(score, Number(score.dataset.score), 1250);
      });
    };
    const switcher = enhanceSwitcher(chapter.querySelector('[data-switcher]'), (_, panel) => play(panel));
    return {
      switcher,
      enter() {
        switcher.placePill();
        play(chapter.querySelector('[data-switcher-panel]:not([hidden])'));
      },
      leave: runs.clear
    };
  },

  // Prints the replay line by line; the changed argument types itself out.
  agentflight(chapter) {
    const runs = timeline();
    const play = panel => {
      runs.clear();
      if (!motion.matches) return;
      const run = panel.querySelector('[data-replay]');
      const lines = [...run.querySelectorAll('.console-lines > li')];
      lines.forEach(line => line.classList.remove('is-shown'));
      run.classList.add('is-armed');
      lines.forEach((line, index) => runs.at(160 + index * (index === 1 ? 420 : 560), () => line.classList.add('is-shown')));
    };
    const switcher = enhanceSwitcher(chapter.querySelector('[data-switcher]'), (_, panel) => play(panel));
    return {
      switcher,
      enter() {
        switcher.placePill();
        play(chapter.querySelector('[data-switcher-panel]:not([hidden])'));
      },
      leave: runs.clear
    };
  }
};

function splitTitle(heading) {
  const text = heading.textContent;
  const mask = document.createElement('span');
  mask.className = 'chapter-title-mask';
  mask.setAttribute('aria-hidden', 'true');
  let index = 0;
  text.split(' ').forEach((word, position, words) => {
    // Letters are grouped per word so the title can only wrap between words.
    const group = document.createElement('span');
    group.className = 'chapter-word';
    for (const letter of word) {
      const char = document.createElement('span');
      char.className = 'chapter-char';
      char.textContent = letter;
      char.style.setProperty('--i', index++);
      group.append(char);
    }
    mask.append(group);
    if (position < words.length - 1) mask.append(' ');
  });
  heading.setAttribute('aria-label', text);
  heading.replaceChildren(mask);
}

function exhibit(root) {
  const chapters = [...root.querySelectorAll('[data-chapter]')];
  const links = [...root.querySelectorAll('[data-chapter-link]')];
  const counter = root.querySelector('[data-counter]');
  const handlers = chapters.map(chapter => demos[chapter.dataset.chapter]?.(chapter));
  let pinned = false;
  let active = -1;
  let frameRequest;

  chapters.forEach(chapter => splitTitle(chapter.querySelector('h3')));

  function setActive(index) {
    if (index === active) return;
    if (active >= 0) {
      chapters[active].classList.remove('is-active');
      handlers[active]?.leave();
    }
    active = index;
    const chapter = chapters[index];
    chapter.classList.add('is-active', 'was-active');
    handlers[index]?.enter();
    links.forEach((link, position) => {
      if (position === index) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    counter.textContent = String(index + 1).padStart(2, '0');
    root.dataset.theme = chapter.dataset.chapter;
    if (pinned) chapters.forEach((other, position) => { other.inert = position !== index; });
  }

  function measure() {
    const box = root.getBoundingClientRect();
    const travel = Math.max(1, box.height - innerHeight);
    return { box, travel, t: clamp(-box.top / travel, 0, 1) * chapters.length };
  }

  // Chapter i rises over i-1 between t = i - 0.45 and t = i + 0.15, leaving time to linger on each.
  const revealAt = (t, index) => (index === 0 ? 1 : smooth(clamp((t - index + 0.45) / 0.6, 0, 1)));

  function update() {
    frameRequest = undefined;
    if (!pinned) return;
    const { box, t } = measure();
    root.style.setProperty('--enter', clamp(box.top / innerHeight, 0, 1).toFixed(4));
    root.style.setProperty('--progress', clamp(t / chapters.length, 0, 1).toFixed(4));
    const reveals = chapters.map((_, index) => revealAt(t, index));
    let current = 0;
    chapters.forEach((chapter, index) => {
      chapter.style.setProperty('--reveal', reveals[index].toFixed(4));
      chapter.style.setProperty('--cover', (reveals[index + 1] ?? 0).toFixed(4));
      if (reveals[index] > 0.5) current = index;
    });
    if (box.top < innerHeight && box.bottom > 0) setActive(current);
  }

  const schedule = () => {
    if (frameRequest === undefined) frameRequest = requestAnimationFrame(update);
  };

  function setMode() {
    pinned = roomy.matches && motion.matches;
    root.toggleAttribute('data-pinned', pinned);
    root.toggleAttribute('data-live', motion.matches);
    if (!pinned) {
      for (const chapter of chapters) {
        chapter.inert = false;
        chapter.style.removeProperty('--reveal');
        chapter.style.removeProperty('--cover');
      }
    } else if (active >= 0) {
      chapters.forEach((other, position) => { other.inert = position !== active; });
    }
    schedule();
    handlers.forEach(handler => handler?.switcher.placePill());
  }

  // Stacked layout: a chapter becomes active as soon as its top passes 80% of the way down the screen,
  // so its content is never waiting on a tall, empty card.
  const watcher = new IntersectionObserver(entries => {
    if (pinned) return;
    for (const entry of entries) {
      if (entry.isIntersecting) setActive(chapters.indexOf(entry.target));
    }
  }, { rootMargin: '0px 0px -20% 0px' });
  chapters.forEach(chapter => watcher.observe(chapter));

  links.forEach((link, index) => link.addEventListener('click', () => {
    if (!pinned) {
      chapters[index].scrollIntoView({ block: 'start', behavior: motion.matches ? 'smooth' : 'auto' });
      return;
    }
    const { box, travel } = measure();
    const t = index === 0 ? 0 : index + 0.2;
    scrollTo({ top: scrollY + box.top + (t / chapters.length) * travel, behavior: 'smooth' });
  }));

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  roomy.addEventListener('change', setMode);
  motion.addEventListener('change', setMode);
  setMode();
}

document.querySelectorAll('[data-exhibition]').forEach(exhibit);
