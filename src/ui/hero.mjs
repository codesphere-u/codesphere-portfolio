// The home page opening. Each effect plays once and leaves the page still:
//   • the portrait is typed out as code, then compiles cell by cell into the photograph;
//   • the headline arrives shuffled and sorts itself into place;
//   • the numbers roll into place like an odometer, and the Kampala clock rolls each minute.
// On desktop, hovering the portrait opens a small lens onto the code it was compiled from.
import { motion, splitLetters, sortLetters } from './motion.mjs';

const hero = document.querySelector('[data-hero]');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

if (hero) {
  const lines = splitLetters(hero.querySelector('h1'), { decorate: underlineTrust });
  lines.forEach((chars, index) => sortLetters(chars, { start: 340 + index * 160 }));
  hero.querySelectorAll('[data-count]').forEach(rollCount);
  startClock(hero.querySelector('[data-kampala-time]'));
  compilePortrait(hero.querySelector('.hero-visual'));
  trackScrollExit(hero.querySelector('.hero-stage'));
  magnetize(hero.querySelectorAll('.hero-copy .folio-action'));
  driveMarquee(document.querySelector('[data-marquee]'));
}

// A hand-drawn underline under "trust." that draws itself once the letters have sorted.
function underlineTrust(word, text) {
  if (!/^trust/i.test(text)) return;
  word.insertAdjacentHTML('beforeend',
    '<svg class="hero-underline" viewBox="0 0 220 24" preserveAspectRatio="none" focusable="false"><path d="M4 15 C 46 7, 100 4, 148 9 S 204 19, 216 6" pathLength="1"/></svg>');
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/* ---------- Odometer numbers ---------- */

// Each digit is a strip of 0–9 (three laps) that rolls to its value.
function odometer(target) {
  const readable = element('span', 'sort-readable');
  const visual = element('span', 'odo');
  visual.setAttribute('aria-hidden', 'true');
  target.replaceChildren(readable, visual);
  let cells = [];

  function place(cell, index, animate) {
    cell.index = index;
    if (!animate) cell.strip.style.transition = 'none';
    cell.strip.style.transform = `translateY(${(-1.2 * index).toFixed(2)}em)`;
    if (!animate) {
      void cell.strip.offsetHeight;
      cell.strip.style.transition = '';
    }
  }

  function build(text) {
    visual.replaceChildren();
    cells = [...text].map(character => {
      if (!/\d/.test(character)) {
        visual.append(element('span', 'odo-sep', character));
        return null;
      }
      const digit = element('span', 'odo-digit');
      const strip = element('span', 'odo-strip');
      for (let k = 0; k < 30; k++) strip.append(element('span', '', String(k % 10)));
      digit.append(strip);
      visual.append(digit);
      const cell = { strip, index: 0 };
      // After a roll, quietly jump back to the first lap so the next roll has room.
      strip.addEventListener('transitionend', () => {
        if (cell.index > 9) place(cell, cell.index % 10, false);
      });
      return cell;
    });
  }

  return {
    set(text, { label = text, animate = motion.matches, laps = 0, delay = 0 } = {}) {
      readable.textContent = label;
      const sameShape = cells.length === text.length && [...text].every((c, i) => Boolean(cells[i]) === /\d/.test(c));
      if (!sameShape) build(text);
      [...text].forEach((character, index) => {
        const cell = cells[index];
        if (!cell) return;
        const digit = Number(character);
        if (!animate) {
          place(cell, digit, false);
          return;
        }
        const current = cell.index % 10;
        if (!laps && digit === current) return;
        const turns = laps || (digit < current ? 1 : 0);
        cell.strip.style.transitionDelay = `${delay + index * 90}ms`;
        place(cell, digit + turns * 10, true);
      });
    }
  };
}

function rollCount(target, order) {
  const text = target.dataset.count;
  const counter = odometer(target);
  if (!motion.matches) {
    counter.set(text, { animate: false });
    return;
  }
  counter.set('0'.repeat(text.length), { label: text, animate: false });
  setTimeout(() => counter.set(text, { laps: 2, delay: order * 140 }), 1050);
}

function startClock(target) {
  if (!target) return;
  const format = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Kampala', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const clock = odometer(target);
  target.append(element('small', '', 'EAT'));
  let shown = '';
  const tick = animate => {
    const now = format.format(new Date());
    if (now === shown) return;
    shown = now;
    clock.set(now, { animate });
  };
  tick(false);
  setInterval(() => tick(motion.matches), 5000);
}

/* ---------- Portrait: code compiled into a photograph ---------- */

const GLYPHS = ' .,:;\'"`-_~^+=*<>!?/\\|()[]{}#%&$@0123456789abcdefxyz';

// Glyphs ordered by how much ink they put down, measured in this browser's monospace font.
function glyphRamp(font) {
  const probe = element('canvas');
  probe.width = 24;
  probe.height = 32;
  const context = probe.getContext('2d', { willReadFrequently: true });
  context.font = font;
  context.textBaseline = 'top';
  const scored = [...new Set(GLYPHS)].map(glyph => {
    context.clearRect(0, 0, 24, 32);
    context.fillText(glyph, 2, 2);
    const data = context.getImageData(0, 0, 24, 32).data;
    let ink = 0;
    for (let i = 3; i < data.length; i += 4) ink += data[i];
    return { glyph, ink };
  }).sort((a, b) => a.ink - b.ink);
  return scored.map(({ glyph }) => glyph);
}

function buildScene(visual, image) {
  const width = visual.offsetWidth;
  const height = visual.offsetHeight;
  const scale = Math.min(devicePixelRatio || 1, 2);
  const cellW = width < 520 ? 7 : 8;
  const cellH = Math.round(cellW * 1.62);
  const cols = Math.ceil(width / cellW);
  const rows = Math.ceil(height / cellH);

  // Match the <img>'s object-fit: cover and object-position exactly.
  const [px, py] = getComputedStyle(image).objectPosition.split(' ').map(value => parseFloat(value) / 100);
  const fit = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawW = image.naturalWidth * fit;
  const drawH = image.naturalHeight * fit;
  const photo = {
    x: (width - drawW) * (Number.isFinite(px) ? px : 0.5),
    y: (height - drawH) * (Number.isFinite(py) ? py : 0.5),
    w: drawW,
    h: drawH
  };

  // One pixel per cell: the photo averaged down to the grid.
  const pixels = element('canvas');
  pixels.width = cols;
  pixels.height = rows;
  const pixelContext = pixels.getContext('2d', { willReadFrequently: true });
  pixelContext.imageSmoothingQuality = 'high';
  pixelContext.drawImage(image, photo.x / cellW, photo.y / cellH, photo.w / cellW, photo.h / cellH);
  const colours = pixelContext.getImageData(0, 0, cols, rows).data;

  // The code layer: each cell becomes a glyph as dense as the photo is bright, in the photo's colour.
  const fontSize = Math.round(cellH * 0.86);
  const font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  const ramp = glyphRamp(font);
  const code = element('canvas');
  code.width = Math.round(width * scale);
  code.height = Math.round(height * scale);
  const codeContext = code.getContext('2d');
  codeContext.setTransform(scale, 0, 0, scale, 0, 0);
  codeContext.fillStyle = '#0d0f16';
  codeContext.fillRect(0, 0, width, height);
  codeContext.font = font;
  codeContext.textBaseline = 'top';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const [r, g, b] = [colours[i], colours[i + 1], colours[i + 2]];
      const light = clamp(((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 - 0.05) / 0.72, 0, 1) ** 0.82;
      if (light < 0.035) continue;
      codeContext.fillStyle = `rgb(${Math.min(255, r * 1.3 + 30)}, ${Math.min(255, g * 1.22 + 24)}, ${Math.min(255, b * 1.1 + 20)})`;
      codeContext.fillText(ramp[Math.round(light * (ramp.length - 1))], x * cellW, y * cellH + (cellH - fontSize) / 2);
    }
  }

  // When each cell compiles: a diagonal sweep from the top left, roughened with noise.
  const order = new Float32Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      order[y * cols + x] = 0.72 * (0.66 * (y / rows) + 0.34 * (x / cols)) + 0.22 * Math.random();
    }
  }

  return { width, height, scale, cols, rows, cellW, cellH, gridW: cols * cellW, gridH: rows * cellH, photo, pixels, code, order };
}

async function compilePortrait(visual) {
  const image = visual.querySelector('img');
  const canvas = visual.querySelector('.hero-compile');
  const release = () => hero.setAttribute('data-compiled', '');
  if (!motion.matches) {
    release();
    return;
  }

  // Only compile if the photo is ready promptly; otherwise just show it.
  const ready = await Promise.race([
    image.decode().then(() => true, () => false),
    new Promise(resolve => setTimeout(() => resolve(false), 1200))
  ]);
  if (!ready || !image.naturalWidth) {
    release();
    return;
  }

  let scene = buildScene(visual, image);
  const context = canvas.getContext('2d');
  const work = element('canvas');
  const workContext = work.getContext('2d');
  const masks = [element('canvas'), element('canvas')];
  const maskContexts = masks.map(mask => mask.getContext('2d'));

  function size() {
    for (const target of [canvas, work]) {
      target.width = Math.round(scene.width * scene.scale);
      target.height = Math.round(scene.height * scene.scale);
    }
    context.setTransform(scene.scale, 0, 0, scene.scale, 0, 0);
    workContext.setTransform(scene.scale, 0, 0, scene.scale, 0, 0);
    for (const mask of masks) {
      mask.width = scene.cols;
      mask.height = scene.rows;
    }
  }
  size();

  // Paints a layer onto the canvas only where the given cell mask allows.
  function drawMasked(paint, mask) {
    workContext.globalCompositeOperation = 'source-over';
    workContext.clearRect(0, 0, scene.width, scene.height);
    paint(workContext);
    workContext.globalCompositeOperation = 'destination-in';
    workContext.imageSmoothingEnabled = false;
    workContext.drawImage(mask, 0, 0, scene.gridW, scene.gridH);
    workContext.imageSmoothingEnabled = true;
    workContext.globalCompositeOperation = 'source-over';
    context.drawImage(work, 0, 0, scene.width, scene.height);
  }

  const PRINT = 620;
  const COMPILE = 1350;
  const SPAN = 1.16;
  const pixelMask = new ImageData(scene.cols, scene.rows);
  const photoMask = new ImageData(scene.cols, scene.rows);
  const begin = performance.now();
  canvas.hidden = false;

  await new Promise(resolve => {
    const frame = now => {
      const elapsed = now - begin;
      const { width, height, rows, cellW, cellH } = scene;
      context.fillStyle = '#0d0f16';
      context.fillRect(0, 0, width, height);

      if (elapsed < PRINT) {
        // Typed out top to bottom, with a cursor on the current line.
        const progress = (elapsed / PRINT) * rows;
        const row = Math.floor(progress);
        const column = (progress - row) * width;
        context.save();
        context.beginPath();
        context.rect(0, 0, width, row * cellH);
        context.rect(0, row * cellH, column, cellH);
        context.clip();
        context.drawImage(scene.code, 0, 0, width, height);
        context.restore();
        context.fillStyle = '#ffcb8d';
        context.fillRect(column, row * cellH, cellW, cellH);
        requestAnimationFrame(frame);
        return;
      }

      // Each cell goes code → pixel → photograph.
      const progress = ((elapsed - PRINT) / COMPILE) * SPAN;
      for (let i = 0; i < scene.order.length; i++) {
        const t = progress - scene.order[i];
        pixelMask.data[i * 4 + 3] = clamp(t / 0.07, 0, 1) * 255;
        photoMask.data[i * 4 + 3] = clamp((t - 0.09) / 0.11, 0, 1) * 255;
      }
      maskContexts[0].putImageData(pixelMask, 0, 0);
      maskContexts[1].putImageData(photoMask, 0, 0);

      context.drawImage(scene.code, 0, 0, width, height);
      drawMasked(target => {
        target.imageSmoothingEnabled = false;
        target.drawImage(scene.pixels, 0, 0, scene.gridW, scene.gridH);
        target.imageSmoothingEnabled = true;
      }, masks[0]);
      drawMasked(target => target.drawImage(image, scene.photo.x, scene.photo.y, scene.photo.w, scene.photo.h), masks[1]);

      if (progress < SPAN) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });

  // Done: the real photograph takes over and the canvas leaves the page.
  release();
  canvas.hidden = true;
  context.clearRect(0, 0, scene.width, scene.height);

  // Keep the code layer in step with the portrait's size for the lens.
  let resizeTimer;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      scene = buildScene(visual, image);
      size();
    }, 200);
  });

  openLens(visual, canvas, context, () => scene);
}

// Hovering the portrait shows the code underneath it through a small lens.
function openLens(visual, canvas, context, currentScene) {
  if (!finePointer.matches) return;
  const stage = visual.closest('.hero-stage');
  const lens = { x: 0, y: 0, open: 0, target: 0 };
  let frame;

  const draw = () => {
    frame = undefined;
    const scene = currentScene();
    lens.open += (lens.target - lens.open) * 0.2;
    if (Math.abs(lens.target - lens.open) < 0.01) lens.open = lens.target;
    context.clearRect(0, 0, scene.width, scene.height);
    if (lens.open === 0) {
      canvas.hidden = true;
      return;
    }
    canvas.hidden = false;
    const radius = 112 * lens.open;
    context.save();
    context.beginPath();
    context.arc(lens.x, lens.y, radius, 0, Math.PI * 2);
    context.clip();
    context.drawImage(scene.code, 0, 0, scene.width, scene.height);
    context.restore();
    context.strokeStyle = `rgba(255, 203, 141, ${(0.75 * lens.open).toFixed(3)})`;
    context.lineWidth = 1.2;
    context.beginPath();
    context.arc(lens.x, lens.y, radius, 0, Math.PI * 2);
    context.stroke();
    if (lens.open !== lens.target) frame = requestAnimationFrame(draw);
  };
  const schedule = () => {
    if (frame === undefined) frame = requestAnimationFrame(draw);
  };

  stage.addEventListener('pointermove', event => {
    if (!motion.matches || event.pointerType !== 'mouse') return;
    const box = visual.getBoundingClientRect();
    const scene = currentScene();
    const inside = event.clientX > box.left && event.clientX < box.right && event.clientY > box.top && event.clientY < box.bottom;
    lens.target = inside && !event.target.closest('a, button, h1, p, dl') ? 1 : 0;
    lens.x = (event.clientX - box.left) * (scene.width / box.width);
    lens.y = (event.clientY - box.top) * (scene.height / box.height);
    schedule();
  });
  stage.addEventListener('pointerleave', () => {
    lens.target = 0;
    schedule();
  });
}

/* ---------- Smaller touches ---------- */

// As the opening scrolls away, the copy lifts and the portrait zooms and dims.
function trackScrollExit(stage) {
  let frame;
  const update = () => {
    frame = undefined;
    const box = stage.getBoundingClientRect();
    stage.style.setProperty('--exit', clamp(-box.top / box.height, 0, 1).toFixed(3));
  };
  addEventListener('scroll', () => {
    if (frame === undefined && motion.matches) frame = requestAnimationFrame(update);
  }, { passive: true });
}

function magnetize(buttons) {
  for (const button of buttons) {
    button.addEventListener('pointermove', event => {
      if (!finePointer.matches || !motion.matches) return;
      const box = button.getBoundingClientRect();
      const x = event.clientX - (box.left + box.width / 2);
      const y = event.clientY - (box.top + box.height / 2);
      button.style.translate = `${(x * 0.22).toFixed(1)}px ${(y * 0.34).toFixed(1)}px`;
    });
    button.addEventListener('pointerleave', () => {
      button.style.translate = '';
    });
  }
}

// The band speeds up with scroll velocity and runs backwards when the page scrolls up.
function driveMarquee(track) {
  if (!track) return;
  let lastY = scrollY;
  let direction = 1;
  let rate = 1;
  let frame;
  let visible = false;

  const tick = () => {
    frame = undefined;
    const animation = track.getAnimations()[0];
    if (!animation || !motion.matches) return;
    const delta = scrollY - lastY;
    lastY = scrollY;
    if (delta) direction = Math.sign(delta);
    const target = direction * (1 + Math.min(9, Math.abs(delta) * 0.32));
    rate += (target - rate) * 0.08;
    if (Math.abs(rate - target) < 0.005) rate = target;
    animation.playbackRate = rate;
    if (visible) frame = requestAnimationFrame(tick);
  };

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    lastY = scrollY;
    if (visible && frame === undefined) frame = requestAnimationFrame(tick);
  }).observe(track);
}
