/* =========================================================
   Capítulo 04 · Carta para ti
   Lee SITE.carta: { saludo, parrafos: [], firma }
   El momento más íntimo del sitio: el fondo se aquieta y
   los párrafos aparecen uno tras otro, al ritmo de la lectura.
   Los campos vacíos simplemente no se muestran.
   ========================================================= */
(function () {
  'use strict';

  var S = window.SITE || {};
  var carta = S.carta || {};
  var parrafos = (Array.isArray(carta.parrafos) ? carta.parrafos : [])
    .filter(function (t) { return typeof t === 'string' && t.trim(); });
  var saludo = typeof carta.saludo === 'string' ? carta.saludo.trim() : '';
  var firma = typeof carta.firma === 'string' ? carta.firma.trim() : '';
  var host = document.getElementById('carta-body');
  if (!host || (!parrafos.length && !saludo)) return;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  host.innerHTML = '';
  var letter = el('div', 'letter');
  var paso = 0;

  function agregar(node) {
    node.style.setProperty('--i', paso++);
    letter.appendChild(node);
    return node;
  }

  if (saludo) agregar(el('p', 'letter__greeting', saludo));
  parrafos.forEach(function (t) { agregar(el('p', 'letter__p', t)); });
  if (firma) agregar(el('p', 'letter__sign', firma));

  var mark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  mark.setAttribute('class', 'letter__flor');
  mark.setAttribute('aria-hidden', 'true');
  var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#flor');
  mark.appendChild(use);
  agregar(mark);

  host.appendChild(letter);

  /* ---------- Entrada al llegar al capítulo ---------- */

  var entered = false;
  function enter() {
    if (entered) return;
    entered = true;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { letter.classList.add('is-in'); });
    });
  }
  document.addEventListener('view:change', function (e) {
    if (e.detail.view === 'carta') enter();
  });
  if (window.Router && window.Router.current() === 'carta') enter();
})();
