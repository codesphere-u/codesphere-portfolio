// The site's signature move: a title arrives with its letters shuffled and sorts itself into place.
// It plays once and leaves ordinary, still text behind.
export const motion = matchMedia('(prefers-reduced-motion: no-preference)');

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Splits a heading into lines of letters. Each direct child (text or element) becomes a line, and
// element children keep their tag (so <em> stays <em>). The readable text stays for screen readers.
// `decorate(wordElement, word)` may add extras to a word, such as an underline.
export function splitLetters(heading, { decorate } = {}) {
  const label = heading.textContent.replace(/\s+/g, ' ').trim();
  const visual = element('span', 'sort-split');
  visual.setAttribute('aria-hidden', 'true');
  const lines = [];

  for (const node of [...heading.childNodes]) {
    const text = node.textContent.replace(/\s+/g, ' ').trim();
    if (!text) continue;
    const line = element(node.nodeType === Node.ELEMENT_NODE ? node.localName : 'span', 'sort-line');
    const chars = [];
    text.split(' ').forEach((word, index, words) => {
      const wordElement = element('span', 'sort-word');
      for (const letter of word) {
        const char = element('span', 'sort-char', letter);
        wordElement.append(char);
        chars.push(char);
      }
      decorate?.(wordElement, word);
      line.append(wordElement);
      if (index < words.length - 1) line.append(' ');
    });
    visual.append(line);
    lines.push(chars);
  }

  heading.replaceChildren(element('span', 'sort-readable', label), visual);
  return lines;
}

// Letters start in shuffled seats and travel home along arcs: rightward over, leftward under.
export function sortLetters(chars, { start = 300, duration = 860, stagger = 24 } = {}) {
  if (!motion.matches || chars.length < 2) return;
  const homes = chars.map(char => {
    const box = char.getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  });
  const seats = chars.map((_, index) => index);
  for (let i = seats.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [seats[i], seats[j]] = [seats[j], seats[i]];
  }
  seats.forEach((seat, index) => {
    if (seat === index) {
      const swap = (index + 1) % seats.length;
      [seats[index], seats[swap]] = [seats[swap], seats[index]];
    }
  });

  const size = parseFloat(getComputedStyle(chars[0]).fontSize) || 64;
  const span = Math.max(1, Math.max(...homes.map(home => home.x)) - Math.min(...homes.map(home => home.x)));
  const queue = chars.map((_, index) => index).sort(() => Math.random() - 0.5);

  chars.forEach((char, index) => {
    const from = homes[seats[index]];
    const to = homes[index];
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    const lift = (dx > 0 ? 1 : -1) * size * (0.18 + 0.32 * Math.abs(dx) / span);
    const options = { duration, delay: start + queue.indexOf(index) * stagger, fill: 'backwards' };
    char.animate(
      [{ transform: `translateX(${dx}px)` }, { transform: 'translateX(0)' }],
      { ...options, easing: 'cubic-bezier(.65,0,.35,1)' }
    );
    char.animate([
      { translate: `0 ${dy}px`, easing: 'cubic-bezier(.3,0,.5,1)' },
      { translate: `0 ${dy / 2 + lift}px`, easing: 'cubic-bezier(.5,0,.7,1)', offset: 0.5 },
      { translate: '0 0' }
    ], options);
  });
}

// Every heading marked [data-sort] sorts itself: right away if it is on screen, otherwise when it
// first scrolls into view.
export function sortHeadings(root = document) {
  const headings = [...root.querySelectorAll('[data-sort]')];
  if (!headings.length) return;
  const prepared = new Map(headings.map(heading => [heading, splitLetters(heading)]));
  if (!motion.matches) return;

  const play = heading => {
    prepared.get(heading).forEach((chars, index) => sortLetters(chars, { start: 160 + index * 140 }));
    heading.classList.add('is-sorting');
  };
  const watcher = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      play(entry.target);
    }
  }, { rootMargin: '0px 0px -12% 0px' });
  headings.forEach(heading => watcher.observe(heading));
}
