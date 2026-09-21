/* =========================================================
   Capítulo 01 · Nuestra historia
   Línea de tiempo cronológica. Lee SITE.historia:
     { fecha: 'YYYY-MM-DD', titulo, frase, foto | fotos: [] }
     { hoy: true, titulo, frase }  → hito final con el contador
   El contador cuenta desde SITE.inicio y se refresca solo,
   por si alguien deja la página abierta y cruza la medianoche.
   ========================================================= */
(function () {
  'use strict';

  var S = window.SITE || {};
  var items = (Array.isArray(S.historia) ? S.historia : [])
    .filter(function (m) { return m && (m.titulo || m.fecha || m.hoy); });
  var host = document.getElementById('historia-body');
  if (!host || !items.length) return;

  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
               'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var DIA = 86400000;

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
  function miniPath(p) { return p.replace(/\/([^\/]+)$/, '/mini/$1'); }

  /* Parsea 'YYYY-MM-DD' en hora local (no UTC, para no perder un día). */
  function parse(iso) {
    if (typeof iso !== 'string') return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return isNaN(d.getTime()) ? null : d;
  }
  function fmtFecha(iso) {
    var d = parse(iso);
    if (!d) return iso || '';
    return d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear();
  }
  function hoyLocal() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  function plural(n, uno, varios) { return n + ' ' + (n === 1 ? uno : varios); }

  /* Años, meses y días completos entre dos fechas. */
  function desglose(desde, hasta) {
    var a = hasta.getFullYear() - desde.getFullYear();
    var m = hasta.getMonth() - desde.getMonth();
    var d = hasta.getDate() - desde.getDate();
    if (d < 0) {
      m--;
      d += new Date(hasta.getFullYear(), hasta.getMonth(), 0).getDate();
    }
    if (m < 0) { a--; m += 12; }
    return { a: a, m: m, d: d };
  }
  function textoDesglose(g) {
    var partes = [];
    if (g.a) partes.push(plural(g.a, 'año', 'años'));
    if (g.m) partes.push(plural(g.m, 'mes', 'meses'));
    if (g.d || !partes.length) partes.push(plural(g.d, 'día', 'días'));
    if (partes.length === 1) return partes[0];
    return partes.slice(0, -1).join(', ') + ' y ' + partes[partes.length - 1];
  }

  /* ---------- Construcción ---------- */

  host.innerHTML = '';
  var list = el('ol', 'timeline');
  var momentos = [];
  var contador = null;

  items.forEach(function (m, i) {
    var li = el('li', 'moment' + (m.hoy ? ' moment--hoy' : ''));
    li.style.setProperty('--i', i);

    var node = el('span', 'moment__node');
    node.appendChild(flor('moment__flor'));
    li.appendChild(node);

    var card = el('div', 'moment__card');

    var fechaTxt = m.hoy ? 'Hoy' : fmtFecha(m.fecha);
    if (fechaTxt) card.appendChild(el('p', 'moment__date', fechaTxt));
    if (m.titulo) card.appendChild(el('h3', 'moment__title', m.titulo));

    if (m.hoy) {
      var desde = parse(S.inicio);
      if (desde) {
        contador = el('div', 'counter');
        contador.appendChild(el('span', 'counter__num', '—'));
        contador.appendChild(el('span', 'counter__label', 'días juntos'));
        contador.appendChild(el('span', 'counter__detail', ''));
        contador._desde = desde;
        card.appendChild(contador);
      }
    }

    if (m.frase) card.appendChild(el('p', 'moment__text', m.frase));

    var fotos = Array.isArray(m.fotos) ? m.fotos.slice() : [];
    if (typeof m.foto === 'string' && m.foto) fotos.unshift(m.foto);
    fotos = fotos.filter(function (f) { return typeof f === 'string' && f; });

    if (fotos.length) {
      var wrap = el('div', 'moment__photos');
      if (fotos.length === 1) wrap.classList.add('moment__photos--one');
      fotos.forEach(function (src) {
        var fig = el('span', 'moment__photo');
        var img = document.createElement('img');
        img.alt = m.titulo || 'Recuerdo de este momento';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = miniPath(src);
        img.addEventListener('error', function onErr() {
          img.removeEventListener('error', onErr);
          img.src = src; // sin miniatura: usa la foto completa
        });
        img.addEventListener('load', function () { img.classList.add('is-loaded'); });
        fig.appendChild(img);
        wrap.appendChild(fig);
      });
      card.appendChild(wrap);
    }

    li.appendChild(card);
    list.appendChild(li);
    momentos.push(li);
  });

  host.appendChild(list);

  /* ---------- Contador en vivo ---------- */

  function pintarContador() {
    if (!contador) return;
    var hoy = hoyLocal();
    var desde = contador._desde;
    if (hoy < desde) return;
    var dias = Math.round((hoy - desde) / DIA);
    contador.querySelector('.counter__num').textContent = dias.toLocaleString('es-MX');
    contador.querySelector('.counter__label').textContent = dias === 1 ? 'día juntos' : 'días juntos';
    contador.querySelector('.counter__detail').textContent = textoDesglose(desglose(desde, hoy));
  }
  if (contador) {
    pintarContador();
    setInterval(pintarContador, 60000); // por si cruza la medianoche
  }

  /* ---------- Entrada: cada momento aparece al alcanzarlo ---------- */

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    momentos.forEach(function (li) { li.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
      // threshold 0: basta con que asome. Con umbral mayor, un momento más
      // alto que la pantalla podía quedarse sin revelar en móvil.
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });

    var observar = function () { momentos.forEach(function (li) { io.observe(li); }); };

    // La vista arranca oculta: espera a que el capítulo esté visible.
    if (window.Router && window.Router.current() === 'historia') observar();
    else {
      var once = function (e) {
        if (e.detail.view !== 'historia') return;
        document.removeEventListener('view:change', once);
        observar();
      };
      document.addEventListener('view:change', once);
    }
  }
})();
