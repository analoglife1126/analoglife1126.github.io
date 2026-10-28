(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  function closeMenu() {
    links.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', '展开导航');
  }
  menu.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-label', isOpen ? '收起导航' : '展开导航');
  });
  links.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav') && links.classList.contains('is-open')) closeMenu();
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
  const copy = document.querySelector('.copy-email');
  const status = document.querySelector('.copy-status');
  copy.addEventListener('click', async () => {
    const email = copy.dataset.email;
    let success = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        success = true;
      } else {
        const field = document.createElement('textarea');
        field.value = email;
        field.setAttribute('aria-hidden', 'true');
        field.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.appendChild(field);
        field.select();
        success = document.execCommand('copy');
        field.remove();
        copy.focus();
      }
    } catch (_) { /* A blocked clipboard still leaves a selectable email and mailto link. */ }
    status.textContent = success ? '邮箱已复制，期待与你交流。' : '请长按或选中上方邮箱进行复制。';
  });
  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
