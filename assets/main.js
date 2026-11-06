(() => {
  'use strict';
  const root = document.getElementById('analoglife-page');
  if (!root) return;
  const toggle = root.querySelector('.theme-toggle');
  const year = root.querySelector('#year');
  const canvas = root.querySelector('.branch-art');
  function setTheme(theme) {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    requestAnimationFrame(drawDecoration);
    if (toggle) {
      const label = toggle.querySelector('.theme-label');
      if (label) label.textContent = dark ? '浅色' : '深色';
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.setAttribute('aria-label', dark ? '切换为浅色外观' : '切换为深色外观');
    }
  }
  if (toggle) toggle.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    try { localStorage.setItem('analoglife-theme', root.dataset.theme); } catch (_) { /* Theme works without storage. */ }
  });
  try { setTheme(localStorage.getItem('analoglife-theme')); } catch (_) { /* Default to light. */ }
  function openHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (_) { return; }
    if (!id) return;
    const target = document.getElementById(id);
    if (target && root.contains(target) && target.tagName === 'DETAILS') target.open = true;
  }
  openHash();
  window.addEventListener('hashchange', openHash);
  if (year) year.textContent = String(new Date().getFullYear());

  function drawDecoration() {
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const width = root.clientWidth;
    const height = Math.min(root.scrollHeight, 2400);
    if (!width || !height) return;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.clearRect(0, 0, width, height);
    context.strokeStyle = getComputedStyle(root).getPropertyValue('--twig').trim();
    context.lineCap = 'round';
    let seed = 826;
    function random() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    function twig(x, y, length, angle, depth) {
      if (depth < 1 || length < 3) return;
      const bend = (random() - .5) * .5;
      const endX = x + Math.cos(angle + bend) * length;
      const endY = y + Math.sin(angle + bend) * length;
      context.globalAlpha = .055 + depth * .011;
      context.lineWidth = .25 + depth * .07;
      context.beginPath();
      context.moveTo(x, y);
      context.quadraticCurveTo(x + Math.cos(angle) * length * .55, y + Math.sin(angle) * length * .55, endX, endY);
      context.stroke();
      twig(endX, endY, length * (.73 + random() * .08), angle + bend, depth - 1);
      twig(endX, endY, length * (.48 + random() * .15), angle + (random() > .5 ? 1 : -1) * (.45 + random() * .55), depth - 1);
      if (depth > 4 && random() > .4) twig(x + (endX-x)*.6, y + (endY-y)*.6, length * .42, angle - .75, depth - 2);
    }
    twig(-30, 18, Math.min(width * .18, 150), .55, 10);
    twig(width * .47, -40, 135, 1.65, 10);
    twig(-40, Math.min(height * .65, 720), 130, -.8, 10);
    twig(width + 35, Math.min(height * .75, 1100), 115, -2.6, 9);
    context.globalAlpha = 1;
  }
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => requestAnimationFrame(drawDecoration));
    observer.observe(root);
  } else window.addEventListener('resize', drawDecoration);
  requestAnimationFrame(drawDecoration);

})();
