// Hero headline typing effect: types a phrase, holds, erases it, then types the next one, looping.
// The headline keeps the height of its tallest phrase so nothing below it jumps around.
(() => {
  const title = document.querySelector('[data-cycle]');
  const root = document.documentElement;
  const done = () => root.classList.remove('typing-pending');
  if (!title || matchMedia('(prefers-reduced-motion: reduce)').matches) { done(); return; }

  // Each phrase is a list of parts; `em` parts use the accent colour, `br` breaks the line.
  const phrases = [
    [{ t: '장면의 흐름을 잇고,' }, { br: true }, { t: '이야기의 감정을 전합니다.', em: true }],
    [{ t: '안녕하세요.' }, { br: true }, { t: '몰입감 있는 편집과 탄탄한 서사로 이야기를 완성하는 영상 편집자 ' }, { t: '김성수', em: true }, { t: '입니다.' }]
  ];
  const TYPE = 85, ERASE = 30, HOLD = 2200, GAP = 450;   // ms

  const lengthOf = p => p.reduce((n, s) => n + (s.t ? [...s.t].length : 0), 0);
  const esc = c => c.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const render = (p, n) => {
    let html = '', left = n;
    for (const s of p) {
      if (s.br) { if (left > 0 || n === lengthOf(p)) html += '<br>'; continue; }
      const chars = [...s.t].slice(0, Math.max(0, left));
      left -= [...s.t].length;
      if (chars.length) html += s.em ? `<em>${esc(chars.join(''))}</em>` : esc(chars.join(''));
      if (left <= 0) break;
    }
    return html;
  };
  const plain = p => p.map(s => (s.br ? ' ' : s.t)).join('').replace(/\s+/g, ' ').trim();

  // Screen readers get both phrases as plain text once; the animated copy is hidden from them.
  title.setAttribute('aria-label', phrases.map(plain).join(' '));
  const typed = document.createElement('span');
  typed.setAttribute('aria-hidden', 'true');
  const cursor = document.createElement('span');
  cursor.className = 'type-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  // Reserve the height of the tallest phrase at the current width.
  const reserve = () => {
    title.style.minHeight = '';
    let max = 0;
    for (const p of phrases) {
      typed.innerHTML = render(p, lengthOf(p));
      max = Math.max(max, title.offsetHeight);
    }
    title.style.minHeight = max + 'px';
  };

  title.textContent = '';
  title.append(typed, cursor);
  reserve();
  typed.innerHTML = '';
  done();
  addEventListener('resize', () => { const keep = typed.innerHTML; reserve(); typed.innerHTML = keep; });

  let pi = 0, n = 0, erasing = false;
  const tick = () => {
    const p = phrases[pi], len = lengthOf(p);
    if (!erasing) {
      n++;
      typed.innerHTML = render(p, n);
      if (n >= len) { erasing = true; return setTimeout(tick, HOLD); }
      return setTimeout(tick, TYPE);
    }
    n--;
    typed.innerHTML = render(p, n);
    if (n <= 0) { erasing = false; pi = (pi + 1) % phrases.length; return setTimeout(tick, GAP); }
    setTimeout(tick, ERASE);
  };
  setTimeout(tick, 350);
})();
