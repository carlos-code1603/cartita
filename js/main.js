/* =========================================================
   Arranque: copia desde data.js, navegación, menú móvil,
   gestos para "entrar" desde la portada.
   ========================================================= */
(function () {
  'use strict';

  var body = document.body;
  var S = window.SITE || {};

  /* ---------- Copia editable desde data.js ---------- */
  function get(obj, path) {
    var parts = path.split('.');
    for (var i = 0; i < parts.length; i++) {
      if (obj == null) return undefined;
      obj = obj[parts[i]];
    }
    return obj;
  }
  var copyNodes = document.querySelectorAll('[data-copy]');
  for (var i = 0; i < copyNodes.length; i++) {
    var val = get(S, copyNodes[i].getAttribute('data-copy'));
    if (typeof val === 'string' && val.trim()) copyNodes[i].textContent = val;
  }
  if (S.nombre) {
    var brand = document.querySelector('.nav__brand-text');
    if (brand) brand.textContent = 'Para ' + S.nombre;
  }

  /* ---------- Navegación: enlace activo + menú móvil ---------- */
  var nav = document.getElementById('nav');
  var menu = document.getElementById('menu');
  var toggle = document.querySelector('.nav__toggle');
  var routeLinks = document.querySelectorAll('[data-route]');

  function setActive(view) {
    for (var i = 0; i < routeLinks.length; i++) {
      routeLinks[i].classList.toggle('is-active', routeLinks[i].getAttribute('data-route') === view);
    }
  }

  function openMenu(open) {
    menu.classList.toggle('is-open', open);
    body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }

  toggle.addEventListener('click', function () {
    openMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) openMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) openMenu(false);
  });

  document.addEventListener('view:change', function (e) {
    setActive(e.detail.view);
    openMenu(false);
    wheelAcc = 0;
  });
  if (window.Router) setActive(window.Router.current());

  /* ---------- Nav aparece después de que florece la portada ---------- */
  var startsOnCover = window.Router && window.Router.current() === 'inicio';
  setTimeout(function () { body.classList.add('is-ready'); }, startsOnCover ? 2600 : 200);

  /* ---------- Entrar desde la portada: rueda, deslizar o teclado ---------- */
  var wheelAcc = 0;
  var touchStartY = null;

  function onCover() { return window.Router && window.Router.current() === 'inicio' && !menu.classList.contains('is-open'); }
  function enter() { wheelAcc = 0; window.Router.go('historia'); }

  window.addEventListener('wheel', function (e) {
    if (!onCover()) return;
    if (e.deltaY < 0) { wheelAcc = 0; return; }
    wheelAcc += e.deltaY;
    if (wheelAcc > 240) enter();
  }, { passive: true });

  window.addEventListener('touchstart', function (e) {
    touchStartY = e.touches.length ? e.touches[0].clientY : null;
  }, { passive: true });
  window.addEventListener('touchend', function (e) {
    if (!onCover() || touchStartY == null) return;
    var endY = e.changedTouches.length ? e.changedTouches[0].clientY : touchStartY;
    if (touchStartY - endY > 90) enter();
    touchStartY = null;
  }, { passive: true });

  document.addEventListener('keydown', function (e) {
    if (!onCover()) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && e.target === body)) {
      e.preventDefault();
      enter();
    }
  });
})();
