// Scroll 3D reveal (experimental). Each block tilts up into place as it scrolls into view.
// To remove: delete the effects.css and effects.js lines in index.html.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const selector = [
    'section > .wrap > .eyebrow', '.section-head', '#about .about-grid > div', '.stats-grid > div',
    '.highlight', '.history-year', '.project', '.process-grid article', '.tools article', '.contact-grid > div'
  ].join(',');
  let pending = [...document.querySelectorAll(selector)];
  document.documentElement.classList.add('fx-ready');

  // Items that sit side by side come in one after another.
  pending.forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.matches(selector));
    el.style.setProperty('--fx-delay', Math.min(siblings.indexOf(el), 5) * 0.12 + 's');
    el.classList.add('fx');
  });

  const show = el => { el.classList.remove('fx', 'fx-in'); el.style.removeProperty('--fx-delay'); };
  const reveal = el => {
    el.classList.add('fx-in');
    // Once in place, drop the effect classes so the cards' own hover lift works again.
    const done = ev => {
      if (ev.target !== el || ev.propertyName !== 'transform') return;
      el.removeEventListener('transitionend', done);
      show(el);
    };
    el.addEventListener('transitionend', done);
  };

  const check = () => {
    const trigger = innerHeight * 0.9;
    pending = pending.filter(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return true;      // hidden by a filter: wait
      if (r.bottom < 0) { show(el); return false; }            // jumped past it: show at once
      if (r.top < trigger) { reveal(el); return false; }       // scrolled into view: animate
      return true;
    });
    if (!pending.length) { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); }
  };

  let last = 0, timer = 0;
  const onScroll = () => {
    const now = Date.now();
    clearTimeout(timer);
    if (now - last > 80) { last = now; check(); }
    timer = setTimeout(check, 100);                            // catch the final position
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  // Filter buttons can reveal cards that were hidden.
  document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => setTimeout(check, 0)));
  check();
})();
