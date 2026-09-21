/* =========================================================
   Campo de flores amarillas — Canvas 2D, sin dependencias.
   Vive detrás de todo el sitio. En la portada se ve completo;
   en los capítulos se calma (menos vaivén, menos parallax).
   API: window.Field.setMode('cover' | 'inner'), pause(), resume()
   ========================================================= */
(function () {
  'use strict';

  var canvas = document.getElementById('field');
  if (!canvas) return;
  var ctx = canvas.getContext('2d', { alpha: false });
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var PETALS = [
    ['#FFD966', '#F2B84B'],
    ['#FFC93C', '#E8A62A'],
    ['#FFE07A', '#F5C043'],
    ['#FFB627', '#DE8F1E'],
    ['#FFD24D', '#EEAA35']
  ];
  var CENTERS = [
    ['#5B3A1E', '#8A5A2B'],
    ['#4A2E15', '#7A4B22'],
    ['#6B4423', '#A0672F']
  ];
  var DAISY_CENTER = ['#E08E2B', '#F7C55C'];

  var W = 0, H = 0, DPR = 1, horizon = 0;
  var flowers = [], particles = [];
  var bg = null;
  var startTime = 0, lastTime = 0;
  var running = false, rafId = 0;
  var mode = 'cover';
  var calm = 0;                              // 0 = portada, 1 = capítulo (interpolado)
  var pointer = { x: 0, y: 0, tx: 0, ty: 0 }; // parallax normalizado -1..1
  var sun = { x: 0, y: 0 };

  function rand(a, b) { return a + Math.random() * (b - a); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function easeOutBack(t) {
    var c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  /* ---------- Tamaño y fondo estático ---------- */

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    horizon = Math.round(H * 0.56);
    sun.x = W * 0.68;
    sun.y = horizon * 0.9;
    buildBackground();
    if (!flowers.length) seedFlowers(); else layoutFlowers();
    seedParticles();
    if (reduceMotion) drawStatic();
  }

  function buildBackground() {
    bg = document.createElement('canvas');
    bg.width = canvas.width;
    bg.height = canvas.height;
    var g = bg.getContext('2d');
    g.setTransform(DPR, 0, 0, DPR, 0, 0);

    // Cielo: lavanda → rosa → durazno → crema en el horizonte
    var sky = g.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0.00, '#B7A5DB');
    sky.addColorStop(0.40, '#F1C4C4');
    sky.addColorStop(0.78, '#FFD8A6');
    sky.addColorStop(1.00, '#FFF1C6');
    g.fillStyle = sky;
    g.fillRect(0, 0, W, horizon + 2);

    // Sol: resplandor amplio
    var glow = g.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, Math.max(W, H) * 0.5);
    glow.addColorStop(0.00, 'rgba(255,246,205,0.95)');
    glow.addColorStop(0.10, 'rgba(255,224,150,0.55)');
    glow.addColorStop(0.45, 'rgba(255,205,125,0.14)');
    glow.addColorStop(1.00, 'rgba(255,205,125,0)');
    g.fillStyle = glow;
    g.fillRect(0, 0, W, horizon + 2);

    // Colinas lejanas
    hills(g, horizon, '#BBCFA2', 0.6, 0.075, 0.7);
    hills(g, horizon, '#9DBB84', 0.5, 0.05, 2.3);

    // Suelo
    var ground = g.createLinearGradient(0, horizon, 0, H);
    ground.addColorStop(0.00, '#BFD892');
    ground.addColorStop(0.30, '#94BF67');
    ground.addColorStop(1.00, '#4E7C3B');
    g.fillStyle = ground;
    g.fillRect(0, horizon, W, H - horizon);

    // Bruma en el horizonte
    var haze = g.createLinearGradient(0, horizon - 50, 0, horizon + 90);
    haze.addColorStop(0.0, 'rgba(255,241,200,0)');
    haze.addColorStop(0.45, 'rgba(255,241,200,0.6)');
    haze.addColorStop(1.0, 'rgba(255,241,200,0)');
    g.fillStyle = haze;
    g.fillRect(0, horizon - 50, W, 140);
  }

  function hills(g, base, color, alpha, amp, seed) {
    g.save();
    g.globalAlpha = alpha;
    g.fillStyle = color;
    g.beginPath();
    g.moveTo(0, base + 2);
    for (var x = 0; x <= W + 8; x += 8) {
      var n = Math.sin(x * 0.0035 + seed) * 0.6 + Math.sin(x * 0.0105 + seed * 2.1) * 0.3 + Math.sin(x * 0.021 + seed * 3.7) * 0.1;
      g.lineTo(x, base - (n + 1) * H * amp);
    }
    g.lineTo(W + 8, base + 2);
    g.closePath();
    g.fill();
    g.restore();
  }

  /* ---------- Flores ---------- */

  function seedFlowers() {
    flowers = [];
    var count = Math.round(clamp((W * H) / 5200, 110, 320));
    for (var i = 0; i < count; i++) {
      var depth = Math.pow(Math.random(), 1.45); // más flores lejanas, pocas al frente
      var daisy = Math.random() < 0.14;
      flowers.push({
        nx: Math.random(),
        depth: depth,
        petals: 10 + Math.floor(Math.random() * 6),
        color: pick(PETALS),
        center: daisy ? DAISY_CENTER : pick(CENTERS),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.55, 1.05),
        tilt: rand(-0.22, 0.22),
        born: depth * 0.9 + Math.random() * 0.45,
        leafSide: Math.random() < 0.5 ? -1 : 1,
        leafAt: rand(0.35, 0.6)
      });
    }
    flowers.sort(function (a, b) { return a.depth - b.depth; });
    layoutFlowers();
  }

  function layoutFlowers() {
    var near = H - horizon;
    var maxSize = clamp(Math.min(W, H) * 0.052, 22, 46);
    for (var i = 0; i < flowers.length; i++) {
      var f = flowers[i];
      var d = f.depth;
      f.size = lerp(2.4, maxSize, Math.pow(d, 1.5));
      f.x = (f.nx * 1.12 - 0.06) * W;
      f.y = horizon + Math.pow(d, 1.35) * near * 1.06;
      f.stem = f.size * lerp(2.6, 3.3, ((f.phase / (Math.PI * 2)) + 0.5) % 1);
      f.swayAmp = f.size * 0.42;
      f.sprite = makeSprite(f);
    }
  }

  function petalPath(g, len, w) {
    g.beginPath();
    g.moveTo(len * 0.06, 0);
    g.quadraticCurveTo(len * 0.55, -w, len, 0);
    g.quadraticCurveTo(len * 0.55, w, len * 0.06, 0);
    g.closePath();
    g.fill();
  }

  function makeSprite(f) {
    var r = f.size;
    var pad = Math.ceil(r * 2.4) + 2;
    var s = Math.ceil(pad * 2 * DPR);
    var c = document.createElement('canvas');
    c.width = s; c.height = s;
    var g = c.getContext('2d');
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    g.translate(pad, pad);

    if (r < 4) {
      g.fillStyle = f.color[0];
      g.beginPath(); g.arc(0, 0, r * 1.7, 0, Math.PI * 2); g.fill();
      g.fillStyle = f.center[0];
      g.beginPath(); g.arc(0, 0, r * 0.7, 0, Math.PI * 2); g.fill();
      return { canvas: c, pad: pad };
    }

    var n = r < 9 ? 8 : f.petals;
    var i, a;
    // Capa trasera (más oscura), girada medio paso
    g.fillStyle = f.color[1];
    for (i = 0; i < n; i++) {
      a = (i / n) * Math.PI * 2 + Math.PI / n;
      g.save(); g.rotate(a); petalPath(g, r * 1.95, r * 0.5); g.restore();
    }
    // Capa frontal
    g.fillStyle = f.color[0];
    for (i = 0; i < n; i++) {
      a = (i / n) * Math.PI * 2;
      g.save(); g.rotate(a); petalPath(g, r * 2.2, r * 0.55); g.restore();
    }
    // Brillo suave sobre los pétalos
    var sheen = g.createRadialGradient(-r * 0.4, -r * 0.5, 0, 0, 0, r * 2.2);
    sheen.addColorStop(0, 'rgba(255,255,255,0.28)');
    sheen.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = sheen;
    g.beginPath(); g.arc(0, 0, r * 2.2, 0, Math.PI * 2); g.fill();

    // Centro
    var cg = g.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.05, 0, 0, r * 0.9);
    cg.addColorStop(0, f.center[1]);
    cg.addColorStop(1, f.center[0]);
    g.fillStyle = cg;
    g.beginPath(); g.arc(0, 0, r * 0.82, 0, Math.PI * 2); g.fill();

    // Textura de semillas (solo en flores grandes)
    if (r > 13) {
      g.fillStyle = 'rgba(0,0,0,0.14)';
      var dots = Math.round(r * 1.4);
      for (i = 0; i < dots; i++) {
        var ang = i * 2.39996;
        var rr = r * 0.74 * Math.sqrt(i / dots);
        g.beginPath();
        g.arc(Math.cos(ang) * rr, Math.sin(ang) * rr, Math.max(0.8, r * 0.055), 0, Math.PI * 2);
        g.fill();
      }
    }
    return { canvas: c, pad: pad };
  }

  function stemColor(depth) {
    return 'hsl(102, 38%, ' + Math.round(lerp(60, 30, depth)) + '%)';
  }

  function drawLeaf(x, y, size, side, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + side * 0.9);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.55, -size * 0.35, size * 1.1, 0);
    ctx.quadraticCurveTo(size * 0.55, size * 0.35, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /* ---------- Partículas: polen y pétalos sueltos ---------- */

  function seedParticles() {
    particles = [];
    var n = Math.round(clamp((W * H) / 20000, 24, 70));
    for (var i = 0; i < n; i++) particles.push(newParticle(true));
  }

  function newParticle(anywhere) {
    var petal = Math.random() < 0.28;
    return {
      x: anywhere ? Math.random() * W : rand(-40, W * 0.6),
      y: anywhere ? Math.random() * H : H + rand(10, 60),
      r: petal ? rand(3, 6) : rand(1, 2.8),
      vy: rand(9, 24),
      vx: rand(5, 16),
      wob: rand(0.4, 1.2),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.35, 0.85),
      rot: rand(0, Math.PI * 2),
      spin: rand(-1.2, 1.2),
      petal: petal
    };
  }

  function updateParticles(dt, t) {
    var slow = 1 - calm * 0.55;
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.y -= p.vy * dt * slow;
      p.x += (p.vx + Math.sin(t * p.wob + p.phase) * 12) * dt * slow;
      p.rot += p.spin * dt;
      if (p.y < -20 || p.x > W + 30) particles[i] = newParticle(false);
    }
  }

  function drawParticles(t) {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var a = p.alpha * (0.6 + 0.4 * Math.sin(t * 1.3 + p.phase)) * (1 - calm * 0.35);
      ctx.globalAlpha = a;
      if (p.petal) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = '#FFD966';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = '#FFF3B0';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- Sol y rayos ---------- */

  function drawSun(t) {
    var pulse = 0.5 + 0.5 * Math.sin(t * 0.6);
    var rad = Math.max(W, H) * 0.32;
    var g = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, rad);
    g.addColorStop(0, 'rgba(255,250,220,' + (0.10 + pulse * 0.10) + ')');
    g.addColorStop(1, 'rgba(255,250,220,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Rayos lentos, muy sutiles, solo en la portada
    var rays = (1 - calm) * 0.05;
    if (rays > 0.004) {
      ctx.save();
      ctx.translate(sun.x, sun.y);
      ctx.rotate(t * 0.02);
      ctx.fillStyle = 'rgba(255,240,190,' + rays + ')';
      var len = Math.max(W, H) * 1.4;
      for (var i = 0; i < 7; i++) {
        ctx.rotate(Math.PI * 2 / 7);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(len, -len * 0.06);
        ctx.lineTo(len, len * 0.06);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  }

  /* ---------- Escena ---------- */

  function drawScene(t, dt) {
    ctx.drawImage(bg, 0, 0, W, H);
    drawSun(t);

    var motion = 1 - calm * 0.55;
    var parallaxX = pointer.x * 18 * (1 - calm * 0.6);
    var parallaxY = pointer.y * 8 * (1 - calm * 0.6);

    for (var i = 0; i < flowers.length; i++) {
      var f = flowers[i];
      var life = clamp((t - f.born) / 1.1, 0, 1);
      if (life <= 0) continue;
      var scale = easeOutBack(life);

      var gust = 0.6 + 0.4 * Math.sin(t * 0.5 - f.x * 0.0025);
      var sway = Math.sin(t * f.speed + f.phase) * f.swayAmp * gust * motion;
      var bx = f.x + parallaxX * (0.15 + f.depth);
      var by = f.y + parallaxY * (0.15 + f.depth);
      var stem = f.stem * scale;
      var hx = bx + sway + f.tilt * stem;
      var hy = by - stem;

      if (f.size >= 4) {
        ctx.strokeStyle = stemColor(f.depth);
        ctx.lineWidth = Math.max(1, f.size * 0.13);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(bx + sway * 0.25, by - stem * 0.55, hx, hy);
        ctx.stroke();

        if (f.size > 11) {
          var lt = f.leafAt;
          var lx = lerp(bx, hx, lt) + sway * 0.1;
          var ly = lerp(by, hy, lt);
          ctx.fillStyle = 'hsla(102, 40%, ' + Math.round(lerp(58, 36, f.depth)) + '%, 0.9)';
          drawLeaf(lx, ly, f.size * 0.75, f.leafSide, -Math.PI / 2 + sway / stem);
        }
      }

      var rot = (sway / (f.stem || 1)) * 0.9 + f.tilt * 0.6;
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(rot);
      ctx.scale(scale, scale);
      ctx.drawImage(f.sprite.canvas, -f.sprite.pad, -f.sprite.pad, f.sprite.pad * 2, f.sprite.pad * 2);
      ctx.restore();
    }

    updateParticles(dt, t);
    drawParticles(t);
  }

  function frame(now) {
    if (!running) return;
    var dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    var t = (now - startTime) / 1000;

    var k = 1 - Math.pow(0.002, dt);
    calm = lerp(calm, mode === 'inner' ? 1 : 0, k);
    pointer.x = lerp(pointer.x, pointer.tx, 1 - Math.pow(0.02, dt));
    pointer.y = lerp(pointer.y, pointer.ty, 1 - Math.pow(0.02, dt));

    drawScene(t, dt);
    rafId = requestAnimationFrame(frame);
  }

  function drawStatic() {
    // Sin animación: todo florecido, sin vaivén
    calm = mode === 'inner' ? 1 : 0;
    drawScene(30, 0);
  }

  /* ---------- Control ---------- */

  function start() {
    if (reduceMotion) { drawStatic(); return; }
    if (running) return;
    running = true;
    var now = performance.now();
    if (!startTime) startTime = now;
    lastTime = now;
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  window.addEventListener('resize', (function () {
    var timer;
    return function () { clearTimeout(timer); timer = setTimeout(resize, 120); };
  })());

  window.addEventListener('mousemove', function (e) {
    pointer.tx = (e.clientX / W - 0.5) * 2;
    pointer.ty = (e.clientY / H - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('deviceorientation', function (e) {
    if (e.gamma == null || e.beta == null) return;
    pointer.tx = clamp(e.gamma / 25, -1, 1);
    pointer.ty = clamp((e.beta - 45) / 30, -1, 1);
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else {
      // Evita un salto de tiempo al volver
      var pausedFor = performance.now() - lastTime;
      startTime += pausedFor;
      start();
    }
  });

  window.Field = {
    setMode: function (m) {
      mode = m === 'inner' ? 'inner' : 'cover';
      if (reduceMotion) drawStatic();
    },
    pause: stop,
    resume: start
  };

  resize();
  start();
})();
