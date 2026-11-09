function enhanceSwitcher(root) {
  const controls = root.querySelector(':scope > [data-switcher-controls]');
  const tabs = [...controls.querySelectorAll('button')];
  const panels = [...root.querySelectorAll(':scope > [data-switcher-panel]')];
  controls.setAttribute('role', 'tablist');

  function select(index, moveFocus = false) {
    tabs.forEach((tab, position) => {
      const active = position === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[position].hidden = !active;
    });
    if (moveFocus) tabs[index].focus();
  }

  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      const last = tabs.length - 1;
      const destinations = {
        ArrowLeft: index === 0 ? last : index - 1,
        ArrowRight: index === last ? 0 : index + 1,
        Home: 0,
        End: last
      };
      if (!Object.hasOwn(destinations, event.key)) return;
      event.preventDefault();
      select(destinations[event.key], true);
    });
  });

  select(0);
  controls.hidden = false;
  root.dataset.enhanced = '';
}

document.querySelectorAll('[data-switcher]').forEach(enhanceSwitcher);
