/* ============================================================
   OLIVASCALES — script.js  (v5 — gate animation + brighter stars)
   ============================================================ */

'use strict';

/* ---------- STARLIGHT CANVAS (Rolls-Royce luxury particles) ---------- */
function initStarlightCanvas() {
  const intro = document.getElementById('intro-screen');
  if (!intro) return null;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  intro.insertBefore(canvas, intro.firstChild);

  const ctx = canvas.getContext('2d');
  let W = canvas.width  = intro.offsetWidth  || window.innerWidth;
  let H = canvas.height = intro.offsetHeight || window.innerHeight;

  const onResize = () => {
    W = canvas.width  = intro.offsetWidth  || window.innerWidth;
    H = canvas.height = intro.offsetHeight || window.innerHeight;
  };
  window.addEventListener('resize', onResize, { passive: true });

  /* 90 main stars — clearly visible, luxury brightness */
  const stars = Array.from({ length: 90 }, () => ({
    x:     Math.random(),
    y:     Math.random(),
    r:     Math.random() * 1.5 + 0.5,    /* 0.5–2.0 px */
    base:  Math.random() * 0.28 + 0.12,  /* base opacity 0.12–0.40 */
    amp:   Math.random() * 0.18 + 0.06,  /* twinkle swing */
    phase: Math.random() * Math.PI * 2,
    freq:  Math.random() * 0.011 + 0.003,
    vx:    (Math.random() - 0.5) * 0.035,
    vy:    (Math.random() - 0.5) * 0.035,
    hero:  false,
  }));

  /* 7 large "anchor" hero stars — the standout bright points */
  const heroStars = Array.from({ length: 7 }, () => ({
    x:     Math.random(),
    y:     Math.random(),
    r:     Math.random() * 1.5 + 2.0,   /* 2.0–3.5 px */
    base:  Math.random() * 0.2  + 0.35, /* base opacity 0.35–0.55 */
    amp:   Math.random() * 0.22 + 0.1,
    phase: Math.random() * Math.PI * 2,
    freq:  Math.random() * 0.008 + 0.002,
    vx:    (Math.random() - 0.5) * 0.018,
    vy:    (Math.random() - 0.5) * 0.018,
    hero:  true,
  }));

  const allStars = [...stars, ...heroStars];

  let frame = 0;
  let rafId;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    for (const s of allStars) {
      /* drift + wrap */
      s.x += s.vx / W;
      s.y += s.vy / H;
      if (s.x < 0) s.x = 1; else if (s.x > 1) s.x = 0;
      if (s.y < 0) s.y = 1; else if (s.y > 1) s.y = 0;

      const alpha = Math.max(0, s.base + Math.sin(frame * s.freq + s.phase) * s.amp);

      if (s.hero) {
        /* Hero stars: soft radial glow halo behind them */
        const grd = ctx.createRadialGradient(s.x * W, s.y * H, 0, s.x * W, s.y * H, s.r * 5);
        grd.addColorStop(0, `rgba(255,255,255,${(alpha * 0.55).toFixed(3)})`);
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.fill();
    }

    rafId = requestAnimationFrame(draw);
  }

  draw();

  return function cleanup() {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  };
}

/* ---------- INTRO SCREEN ---------- */
function runIntro() {
  const intro    = document.getElementById('intro-screen');
  const logo     = document.querySelector('.intro-logo');
  const title    = document.querySelector('.intro-title');
  const subtitle = document.querySelector('.intro-subtitle');
  const progress = document.querySelector('.intro-progress-fill');
  const enterBtn = document.getElementById('intro-enter-btn');
  const gateL    = document.querySelector('.intro-gate-left');
  const gateR    = document.querySelector('.intro-gate-right');
  const body     = document.body;

  body.style.overflow = 'hidden';

  /* Launch luxury starlight immediately (behind the gates) */
  const stopStarlight = initStarlightCanvas();

  /* Gates slide open after a brief pause (200ms) — takes ~1400ms */
  setTimeout(() => {
    if (gateL) gateL.classList.add('open');
    if (gateR) gateR.classList.add('open');
  }, 200);

  /* Progress bar starts loading during gate open */
  setTimeout(() => progress.classList.add('loaded'), 500);

  /* Reveal content only after gates are fully open */
  setTimeout(() => logo.classList.add('visible'),     1700);
  setTimeout(() => title.classList.add('visible'),    2300);
  setTimeout(() => subtitle.classList.add('visible'), 2700);

  /* Show STEP INSIDE button after elements settle */
  setTimeout(() => {
    if (enterBtn) enterBtn.classList.add('visible');
  }, 3300);

  /* Manual enter — only button click triggers site reveal */
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      enterBtn.style.pointerEvents = 'none';
      intro.classList.add('fade-out');
      body.style.overflow = '';
      setTimeout(() => {
        if (stopStarlight) stopStarlight();
        intro.remove();
        triggerHeroEntrance();
      }, 1000);
    });
  }
}

/* ---------- HERO ENTRANCE ---------- */
function triggerHeroEntrance() {
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 120);
  });
}

/* ---------- SCROLL REVEALS ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => {
    /* skip hero elements — those are handled by triggerHeroEntrance */
    if (!el.closest('#hero')) io.observe(el);
  });
}

/* ---------- NAVBAR ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  /* Scroll shadow */
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile toggle */
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  /* Active link on scroll */
  const sections = document.querySelectorAll('section[id]');
  const linkMap  = {};
  navLinks.forEach(l => { linkMap[l.getAttribute('href')?.slice(1)] = l; });

  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = linkMap[e.target.id];
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionIO.observe(s));

  /* Close mobile nav on link click */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- FORM ---------- */
function initForm() {
  const form   = document.getElementById('apply-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    status.textContent = '';
    status.className = 'form-status';

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(form),
      });

      if (res.ok) {
        status.textContent = 'Application received. I\'ll be in touch within 48 hours.';
        status.classList.add('success');
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      status.textContent = 'Something went wrong. Please email me directly.';
      status.classList.add('error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Submit Application';
    }
  });
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  runIntro();
  initReveal();
  initNavbar();
  initForm();
});
