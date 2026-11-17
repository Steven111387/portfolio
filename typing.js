// Hero typing effect: the headline types out, then the intro sentence continues, with a blinking cursor.
// Every character is laid out from the start (just invisible), so nothing on the page shifts while typing.
(() => {
  const blocks = [...document.querySelectorAll('[data-type]')];
  if (!blocks.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const speed = el => (el.tagName === 'H1' ? 95 : 38);   // ms per character
  const queue = [];                                        // [{ch, delay}]
  blocks.forEach((block, bi) => {
    block.setAttribute('aria-label', block.textContent.replace(/\s+/g, ' ').trim());
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(node => {
      const frag = document.createDocumentFragment();
      [...node.textContent].forEach(c => {
        const s = document.createElement('span');
        s.className = 'ch';
        s.setAttribute('aria-hidden', 'true');
        s.textContent = c;
        frag.appendChild(s);
        queue.push({ ch: s, delay: speed(block) });
      });
      node.replaceWith(frag);
    });
    if (bi < blocks.length - 1 && queue.length) queue[queue.length - 1].pauseAfter = 450;
  });

  const cursor = document.createElement('span');
  cursor.className = 'type-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.documentElement.classList.add('typing-ready');
  document.documentElement.classList.remove('typing-pending');

  let i = 0;
  const step = () => {
    const item = queue[i++];
    if (!item) return;
    item.ch.classList.add('on');
    item.ch.after(cursor);
    setTimeout(step, item.delay + (item.pauseAfter || 0));
  };
  setTimeout(step, 350);
})();
