/* =========================================================
   Capítulo 02 · Recuerdos — la galería que florece.
   Cada foto empieza como un capullo cerrado. Al tocarlo, los
   pétalos se abren y la foto aparece desde el centro. Una flor
   ya abierta se toca de nuevo para verla en grande (lightbox).
   Lee SITE.recuerdos: [{ foto, pie }]
   Convención: la miniatura vive en la subcarpeta mini/ con el
   mismo nombre (la genera tools/optimizar-fotos.py).
   ========================================================= */
(function () {
  'use strict';

  var S = window.SITE || {};
  var items = Array.isArray(S.recuerdos) ? S.recuerdos.filter(function (r) { return r && r.foto; }) : [];
  var host = document.getElementById('recuerdos-body');
  if (!host || !items.length) return;

  var PETALS = 8;
  var SEPALS = [-38, 0, 38];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function miniPath(p) { return p.replace(/\/([^\/]+)$/, '/mini/$1'); }

  /* ---------- Construcción del jardín ---------- */

  host.innerHTML = '';
  var bar = el('div', 'garden__bar');
  var status = el('p', 'garden__status');
  var allBtn = el('button', 'garden__all', 'Abrir todas');
  allBtn.type = 'button';
  bar.appendChild(status);
  bar.appendChild(allBtn);

  var grid = el('div', 'garden');
  var cards = [];

  items.forEach(function (item, i) {
    var fig = el('figure', 'bloom');
    fig.style.setProperty('--i', i);

    var btn = el('button', 'bloom__btn');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Abrir recuerdo ' + (i + 1) + ' de ' + items.length);

    var photo = el('span', 'bloom__photo');
    var img = document.createElement('img');
    img.alt = item.pie || ('Recuerdo ' + (i + 1));
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = miniPath(item.foto);
    img.addEventListener('error', function onErr() {
      img.removeEventListener('error', onErr);
      img.src = item.foto; // sin miniatura: usa la foto completa
    });
    img.addEventListener('load', function () { img.classList.add('is-loaded'); });
    photo.appendChild(img);

    var flower = el('span', 'bloom__flower');
    SEPALS.forEach(function (a, k) {
      var s = el('span', 'bloom__sepal');
      s.style.setProperty('--a', a + 'deg');
      s.style.setProperty('--k', k);
      flower.appendChild(s);
    });
    var k;
    // --a: ángulo abierto (flor completa) · --c: ángulo cerrado (capullo, centrado)
    var mid = (PETALS - 1) / 2;
    for (k = 0; k < PETALS; k++) {
      var pb = el('span', 'bloom__petal bloom__petal--back');
      pb.style.setProperty('--a', (k * 360 / PETALS + 180 / PETALS) + 'deg');
      pb.style.setProperty('--c', ((k - mid) * 11) + 'deg');
      pb.style.setProperty('--i', k);
      flower.appendChild(pb);
    }
    for (k = 0; k < PETALS; k++) {
      var pf = el('span', 'bloom__petal');
      pf.style.setProperty('--a', (k * 360 / PETALS) + 'deg');
      pf.style.setProperty('--c', ((k - mid) * 8) + 'deg');
      pf.style.setProperty('--i', k);
      flower.appendChild(pf);
    }
    flower.appendChild(el('span', 'bloom__core'));

    btn.appendChild(photo);
    btn.appendChild(el('span', 'bloom__stem'));
    btn.appendChild(flower);
    fig.appendChild(btn);

    var cap = el('figcaption', 'bloom__caption', item.pie || '');
    fig.appendChild(cap);

    btn.addEventListener('click', function () {
      if (fig.classList.contains('is-bloomed')) openLightbox(i);
      else bloom(i);
    });
    btn.addEventListener('pointerenter', function () { img.loading = 'eager'; }, { once: true });

    grid.appendChild(fig);
    cards.push({ fig: fig, btn: btn, img: img, item: item });
  });

  host.appendChild(bar);
  host.appendChild(grid);

  /* ---------- Florecer ---------- */

  function bloomedCount() {
    var n = 0;
    for (var i = 0; i < cards.length; i++) if (cards[i].fig.classList.contains('is-bloomed')) n++;
    return n;
  }

  function updateStatus() {
    var n = bloomedCount();
    if (n === 0) status.textContent = 'Toca un capullo para abrirlo';
    else if (n === cards.length) status.textContent = 'Todas florecieron';
    else status.textContent = n + ' de ' + cards.length + ' han florecido';
    allBtn.hidden = n === cards.length;
  }

  function bloom(i) {
    var c = cards[i];
    if (c.fig.classList.contains('is-bloomed')) return;
    c.img.loading = 'eager';
    c.fig.classList.add('is-bloomed');
    c.btn.setAttribute('aria-label', 'Ver en grande: ' + (c.item.pie || 'recuerdo ' + (i + 1)));
    updateStatus();
  }

  allBtn.addEventListener('click', function () {
    var delay = 0;
    cards.forEach(function (c, i) {
      if (c.fig.classList.contains('is-bloomed')) return;
      setTimeout(function () { bloom(i); }, reduceMotion ? 0 : delay);
      delay += 110;
    });
  });

  updateStatus();

  /* ---------- Entrada escalonada al llegar al capítulo ---------- */

  var entered = false;
  function enter() {
    if (entered) return;
    entered = true;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { grid.classList.add('is-in'); });
    });
  }
  document.addEventListener('view:change', function (e) {
    if (e.detail.view === 'recuerdos') enter();
  });
  if (window.Router && window.Router.current() === 'recuerdos') enter();

  /* ---------- Lightbox ---------- */

  var lb = el('div', 'lightbox');
  lb.hidden = true;
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Recuerdo en grande');

  var closeBtn = el('button', 'lightbox__close');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Cerrar');
  closeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  var prevBtn = el('button', 'lightbox__nav lightbox__nav--prev');
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-label', 'Anterior');
  prevBtn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var nextBtn = el('button', 'lightbox__nav lightbox__nav--next');
  nextBtn.type = 'button';
  nextBtn.setAttribute('aria-label', 'Siguiente');
  nextBtn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var lbFig = el('figure', 'lightbox__fig');
  var lbImg = document.createElement('img');
  lbImg.className = 'lightbox__img';
  lbImg.alt = '';
  var lbCap = el('figcaption', 'lightbox__cap');
  var lbCount = el('span', 'lightbox__count');
  lbFig.appendChild(lbImg);
  lbFig.appendChild(lbCap);
  lbFig.appendChild(lbCount);

  lb.appendChild(closeBtn);
  lb.appendChild(prevBtn);
  lb.appendChild(lbFig);
  lb.appendChild(nextBtn);
  document.body.appendChild(lb);

  var current = -1;
  var lastFocus = null;

  function showItem(i) {
    current = (i + cards.length) % cards.length;
    var c = cards[current];
    bloom(current);
    lbImg.classList.remove('is-loaded');
    lbImg.src = c.item.foto;
    lbImg.alt = c.item.pie || ('Recuerdo ' + (current + 1));
    lbCap.textContent = c.item.pie || '';
    lbCap.hidden = !c.item.pie;
    lbCount.textContent = (current + 1) + ' / ' + cards.length;
    prevBtn.hidden = nextBtn.hidden = cards.length < 2;
  }
  lbImg.addEventListener('load', function () { lbImg.classList.add('is-loaded'); });

  function openLightbox(i) {
    lastFocus = document.activeElement;
    showItem(i);
    lb.hidden = false;
    document.body.classList.add('lightbox-open');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { lb.classList.add('is-open'); closeBtn.focus(); });
    });
  }

  function closeLightbox() {
    if (lb.hidden) return;
    lb.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    setTimeout(function () {
      lb.hidden = true;
      lbImg.removeAttribute('src');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }, reduceMotion ? 0 : 380);
  }

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', function () { showItem(current - 1); });
  nextBtn.addEventListener('click', function () { showItem(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); showItem(current - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); showItem(current + 1); }
  });

  // Deslizar en móvil para cambiar de foto
  var touchX = null;
  lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (touchX == null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 60) showItem(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // Si cambian de capítulo con el lightbox abierto, ciérralo
  document.addEventListener('view:change', closeLightbox);
})();
