/* =========================================================
   Router por hash: #inicio, #historia, #recuerdos, #razones, #carta
   Cada sección es una "vista"; solo una está visible a la vez.
   Transición: la vista actual se desvanece hacia arriba y la
   nueva entra desde abajo. Nunca un corte seco.
   API: window.Router.go(nombre), window.Router.current()
   Evento: document 'view:change' con detail.view
   ========================================================= */
(function () {
  'use strict';

  var VIEWS = ['inicio', 'historia', 'recuerdos', 'razones', 'carta'];
  var TITLES = {
    inicio: 'Para Joss',
    historia: 'Nuestra historia · Para Joss',
    recuerdos: 'Recuerdos · Para Joss',
    razones: 'Razones · Para Joss',
    carta: 'Carta para ti · Para Joss'
  };
  var DURATION = 450;

  var views = {};
  var nodes = document.querySelectorAll('.view');
  for (var i = 0; i < nodes.length; i++) views[nodes[i].getAttribute('data-view')] = nodes[i];

  var current = null;
  var busy = false;
  var pending = null;

  function parse() {
    var h = (location.hash || '').replace(/^#\/?/, '').split('?')[0].toLowerCase();
    return VIEWS.indexOf(h) !== -1 ? h : 'inicio';
  }

  function go(name, immediate) {
    if (name === current) return;
    if (busy) { pending = name; return; }
    var next = views[name];
    if (!next) return;
    var prev = current ? views[current] : null;
    busy = true;

    document.body.setAttribute('data-view', name);
    document.body.classList.toggle('on-cover', name === 'inicio');
    document.title = TITLES[name] || 'Para Joss';
    if (window.Field) window.Field.setMode(name === 'inicio' ? 'cover' : 'inner');

    if (immediate) {
      for (var k in views) {
        if (views[k] !== next) { views[k].hidden = true; views[k].classList.remove('is-active', 'is-leaving'); }
      }
    }

    if (prev && !immediate) {
      prev.classList.add('is-leaving');
      setTimeout(function () {
        prev.classList.remove('is-active', 'is-leaving');
        prev.hidden = true;
        show(next, false);
      }, DURATION);
    } else {
      if (prev) { prev.classList.remove('is-active', 'is-leaving'); prev.hidden = true; }
      show(next, immediate);
    }
  }

  function show(next, immediate) {
    current = next.getAttribute('data-view');
    next.hidden = false;
    window.scrollTo(0, 0);
    // Dos frames para que el navegador registre el estado inicial y anime
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { next.classList.add('is-active'); });
    });
    document.dispatchEvent(new CustomEvent('view:change', { detail: { view: current } }));
    setTimeout(function () {
      busy = false;
      if (pending) { var p = pending; pending = null; go(p, false); }
    }, immediate ? 0 : DURATION);
  }

  window.addEventListener('hashchange', function () { go(parse(), false); });

  window.Router = {
    go: function (name) {
      if (VIEWS.indexOf(name) === -1) name = 'inicio';
      if (parse() === name) go(name, false); else location.hash = name;
    },
    current: function () { return current; },
    views: VIEWS.slice()
  };

  go(parse(), true);
})();
