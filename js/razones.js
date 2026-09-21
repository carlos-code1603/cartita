/* =========================================================
   Capítulo 03 · Razones
   Lee SITE.razones: ['una razón', 'otra razón', ...]
   - Con una sola razón: se muestra centrada y en grande.
   - Con varias: aparece la primera y el botón "Otra razón"
     va revelando el resto, una por una, sin borrar las
     anteriores (para poder volver a leerlas).
   ========================================================= */
(function () {
  'use strict';

  var S = window.SITE || {};
  var items = (Array.isArray(S.razones) ? S.razones : [])
    .filter(function (r) { return typeof r === 'string' && r.trim(); });
  var host = document.getElementById('razones-body');
  if (!host || !items.length) return;

  var single = items.length === 1;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function flor(cls) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', cls);
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#flor');
    svg.appendChild(use);
    return svg;
  }

  host.innerHTML = '';
  var wrap = el('div', 'reasons' + (single ? ' reasons--single' : ''));
  var list = el('ol', 'reasons__list');
  list.setAttribute('aria-live', 'polite');

  var nodes = items.map(function (texto, i) {
    var li = el('li', 'reason');
    li.style.setProperty('--i', i);
    if (!single) li.appendChild(el('span', 'reason__num', ('0' + (i + 1)).slice(-2)));
    li.appendChild(flor('reason__flor'));
    li.appendChild(el('p', 'reason__text', texto));
    if (i > 0) li.hidden = true;
    list.appendChild(li);
    return li;
  });

  wrap.appendChild(list);

  var more = null;
  if (!single) {
    more = el('button', 'reasons__more');
    more.type = 'button';
    more.appendChild(el('span', 'reasons__more-text', 'Otra razón'));
    more.appendChild(el('span', 'reasons__more-count', '1 / ' + items.length));
    wrap.appendChild(more);
  }
  host.appendChild(wrap);

  /* ---------- Revelar ---------- */

  var shown = 1;

  function reveal() {
    if (shown >= nodes.length) return;
    var li = nodes[shown];
    li.hidden = false;
    // Dos frames para que el navegador registre el estado inicial y anime
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { li.classList.add('is-in'); });
    });
    shown++;
    more.querySelector('.reasons__more-count').textContent = shown + ' / ' + items.length;
    if (shown >= nodes.length) {
      more.hidden = true;
      var fin = el('p', 'reasons__end', 'Y así, todos los días.');
      wrap.appendChild(fin);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { fin.classList.add('is-in'); });
      });
    }
    li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (more) more.addEventListener('click', reveal);

  /* ---------- Entrada al llegar al capítulo ---------- */

  var entered = false;
  function enter() {
    if (entered) return;
    entered = true;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { wrap.classList.add('is-in'); });
    });
  }
  document.addEventListener('view:change', function (e) {
    if (e.detail.view === 'razones') enter();
  });
  if (window.Router && window.Router.current() === 'razones') enter();
})();
