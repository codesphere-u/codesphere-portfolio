# Motion and interaction design v2

This release adds kinetic editorial animation while keeping the portfolio usable and legible without JavaScript and with `prefers-reduced-motion` enabled.

## Enhancements
- Atmospheric hero with a subtle topographic grid and slow aura movement.
- Staggered entrance typography focused on the name and engineering positioning.
- IntersectionObserver progressive reveals for career, education and project narrative.
- Responsive project-card hover lighting linked to real pointer position.
- Passive scroll-driven reading progress and keyboard-accessible back-to-top button.
- Focus-visible states and no motion-dependent content or information.
- Animation is decoration, not a substitute for working project filters and architecture explorer.

## Security / performance
- No third-party animation packages, network APIs or user tracking.
- Scroll updates are requestAnimationFrame-coalesced.
- Pointer effects only on fine pointers when reduced-motion is not requested.
- Motion never reveals private information or adds non-functional calls to action.
- Browser content is fully readable in unsupported/older browsers.
- UI quality must still be checked using a real browser, including mobile, light mode and reduced-motion emulation.

## Publishing note
Run `npm test` or `npm run build` to regenerate `index.html` and `dist/`; both are build outputs. A deployment must build from source or include regenerated artifacts.
