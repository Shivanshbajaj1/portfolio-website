/* ============================================
   MAIN.JS — site interactivity
   Organized as small, independent modules.
   Each module checks for its own DOM before running.
   ============================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Skill data (rendered from JS to keep markup DRY) ---------- */
  const SKILLS = [
    { name: 'Python', level: 'Proficient', icon: 'M9 3h6a3 3 0 0 1 3 3v3H9v1h9a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-2v-3a3 3 0 0 0-3-3H9a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Zm.5 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z M6 12v3a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-3h6v-1H3a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3h2v3Zm8.5 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z' },
    { name: 'Machine Learning', level: 'Building', icon: 'M12 2a4 4 0 0 1 4 4c0 1-.4 1.9-1 2.6.6.7 1 1.6 1 2.6a4 4 0 0 1-1 2.6c.6.7 1 1.6 1 2.6a4 4 0 0 1-8 0c0-1 .4-1.9 1-2.6a3.98 3.98 0 0 1-1-2.6c0-1 .4-1.9 1-2.6A3.98 3.98 0 0 1 8 6a4 4 0 0 1 4-4Z M12 22v-4' },
    { name: 'Computer Vision', level: 'Applied', icon: 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' },
    { name: 'HTML', level: 'Proficient', icon: 'm3 2 1.6 18L12 22l7.4-2L21 2H3Zm14.3 5.7H8.2l.2 2.3h8.6l-.6 6.6-4.4 1.3-4.4-1.3-.3-3h2.1l.1 1.4 2.5.7 2.5-.7.2-2.7H7.6l-.6-6.9h9.7l-.1 2.3Z' },
    { name: 'CSS', level: 'Proficient', icon: 'm3 2 1.6 18L12 22l7.4-2L21 2H3Zm14.3 5.7H8.2l.2 2.3h8.6l-.6 6.6-4.4 1.3-4.4-1.3-.3-3h2.1l.1 1.4 2.5.7 2.5-.7.2-2.7H7.6l-.6-6.9h9.7l-.1 2.3Z' },
    { name: 'Git', level: 'Proficient', icon: 'M12 2 2 12l10 10 10-10L12 2Zm0 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-3 3.5 1.5 1.5M15 10l-1.5 1.5M12 12.5V16a1.5 1.5 0 1 0 3 0' },
    { name: 'GitHub', level: 'Proficient', icon: 'M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.19 1.78 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.11 0 1.53-.01 2.76-.01 3.13 0 .3.21.66.79.55A10.52 10.52 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z' },
    { name: 'AWS', level: 'Learning', icon: 'M6 19a4 4 0 0 1-1-7.87A5 5 0 0 1 15 8a4.5 4.5 0 0 1 1 8.9M8 19h9' },
    { name: 'SQL', level: 'Familiar', icon: 'M4 5c0-1.66 3.58-3 8-3s8 1.34 8 3-3.58 3-8 3-8-1.34-8-3Zm0 0v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5 M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3' },
    { name: 'Data Structures', level: 'Learning', icon: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z' },
    { name: 'Algorithms', level: 'Learning', icon: 'M3 12h4l3-9 4 18 3-9h4' },
    { name: 'OpenCV / MediaPipe', level: 'Applied', icon: 'M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z' }
  ];

  function renderSkills() {
    const grid = document.querySelector('.skills__grid');
    if (!grid) return;

    const frag = document.createDocumentFragment();
    SKILLS.forEach((skill, i) => {
      const card = document.createElement('div');
      card.className = 'skill-card';
      card.setAttribute('data-reveal', '');
      card.style.setProperty('--reveal-delay', `${(i % 4) * 60}ms`);
      card.innerHTML = `
        <div class="skill-card__icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="${skill.icon}"/>
          </svg>
        </div>
        <span class="skill-card__name">${skill.name}</span>
        <span class="skill-card__level">${skill.level}</span>
      `;
      frag.appendChild(card);
    });
    grid.appendChild(frag);

    // newly injected [data-reveal] nodes need observing
    observeReveals();
  }

  /* ---------- Loader ---------- */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    const hide = () => loader.classList.add('is-hidden');
    if (document.readyState === 'complete') {
      setTimeout(hide, 400);
    } else {
      window.addEventListener('load', () => setTimeout(hide, 400));
      // safety fallback in case load event is delayed by slow assets
      setTimeout(hide, 2200);
    }
  }

  /* ---------- Sticky nav + active link + progress bar ---------- */
  function initNav() {
    const nav = document.getElementById('nav');
    const progress = document.getElementById('scrollProgress');
    const links = document.querySelectorAll('.nav__link');
    const sections = Array.from(links)
      .map(l => document.getElementById(l.dataset.section))
      .filter(Boolean);

    function onScroll() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (nav) nav.classList.toggle('is-scrolled', scrollY > 40);
      if (progress) progress.style.width = `${docHeight > 0 ? (scrollY / docHeight) * 100 : 0}%`;

      // back to top visibility
      const toTop = document.getElementById('toTop');
      if (toTop) toTop.classList.toggle('is-visible', scrollY > 600);

      // active link (find last section whose top has passed the trigger line)
      let current = sections[0];
      const triggerLine = scrollY + window.innerHeight * 0.35;
      for (const sec of sections) {
        if (sec.offsetTop <= triggerLine) current = sec;
      }
      links.forEach(l => l.classList.toggle('active-link', l.dataset.section === current?.id));
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobileMenu');
    if (!burger || !menu) return;

    function close() {
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function toggle() {
      const isOpen = burger.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
      menu.classList.toggle('is-open', isOpen);
      menu.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    burger.addEventListener('click', toggle);
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ---------- Typewriter ---------- */
  function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const words = ['AI/ML Engineer', 'Python Developer', 'Machine Learning Enthusiast', 'Computer Vision Learner', 'Cloud Computing Enthusiast'];

    if (prefersReducedMotion) {
      el.textContent = words[0];
      return;
    }

    let wordIndex = 0, charIndex = 0, isDeleting = false;

    function tick() {
      const current = words[wordIndex];
      if (!isDeleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(tick, isDeleting ? 35 : 65);
    }
    tick();
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  let revealObserver;
  function observeReveals() {
    const els = document.querySelectorAll('[data-reveal]:not(.is-observed)');
    if (!els.length) return;

    if (prefersReducedMotion) {
      els.forEach(el => el.classList.add('is-visible', 'is-observed'));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    }

    els.forEach(el => {
      const delayAttr = el.getAttribute('data-reveal-delay');
      if (delayAttr) el.style.setProperty('--reveal-delay', `${delayAttr}ms`);
      el.classList.add('is-observed');
      revealObserver.observe(el);
    });
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    const counters = document.querySelectorAll('.achievement__num');
    if (!counters.length) return;

    function animateCounter(el) {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (prefersReducedMotion) { el.textContent = target; return; }

      const duration = 1400;
      const start = performance.now();

      function frame(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(frame);
        else el.textContent = target;
      }
      requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => io.observe(c));
  }

  /* ---------- Timeline fill on scroll ---------- */
  function initTimelineFill() {
    const timeline = document.querySelector('.timeline');
    const fill = document.getElementById('timelineFill');
    if (!timeline || !fill) return;

    function update() {
      const rect = timeline.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = rect.height;
      const visible = Math.min(Math.max(viewportH * 0.7 - rect.top, 0), total);
      const pct = total > 0 ? (visible / total) * 100 : 0;
      fill.style.height = `${pct}%`;
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Cursor glow (desktop, hover-capable only) ---------- */
  function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || !window.matchMedia('(hover: hover)').matches || prefersReducedMotion) return;

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let curX = mouseX, curY = mouseY;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function raf() {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      glow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      requestAnimationFrame(raf);
    }
    raf();
  }

  /* ---------- Back to top ---------- */
  function initToTop() {
    const btn = document.getElementById('toTop');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Smooth anchor scroll (accounts for fixed nav) ---------- */
  function initSmoothAnchors() {
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - (navH - 8);
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    renderSkills();
    initNav();
    initMobileMenu();
    initTypewriter();
    observeReveals();
    initCounters();
    initTimelineFill();
    initCursorGlow();
    initToTop();
    initSmoothAnchors();
  });
})();
