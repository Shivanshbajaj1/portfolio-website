/* ============================================
   PARTICLES — lightweight ambient canvas
   No dependencies. Pauses off-screen / reduced motion.
   ============================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let width, height, particles = [];
  let animId = null;
  let isVisible = true;

  const COLORS = ['139,92,246', '59,130,246', '236,72,153'];
  const COUNT_DESKTOP = 55;
  const COUNT_MOBILE = 24;

  function getCount() {
    return window.innerWidth < 768 ? COUNT_MOBILE : COUNT_DESKTOP;
  }

  function resize() {
    width = canvas.width = canvas.offsetWidth * devicePixelRatio;
    height = canvas.height = canvas.offsetHeight * devicePixelRatio;
    canvas.style.width = canvas.offsetWidth + 'px';
    canvas.style.height = canvas.offsetHeight + 'px';
  }

  function makeParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: (Math.random() * 1.4 + 0.5) * devicePixelRatio,
      vx: (Math.random() - 0.5) * 0.15 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.15 * devicePixelRatio,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.4 + 0.15
    };
  }

  function init() {
    resize();
    const count = getCount();
    particles = Array.from({ length: count }, makeParticle);
  }

  function step() {
    if (!isVisible) {
      animId = requestAnimationFrame(step);
      return;
    }
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();
    }

    animId = requestAnimationFrame(step);
  }

  // Pause when tab is hidden — saves battery / CPU
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });

  init();
  step();
})();
