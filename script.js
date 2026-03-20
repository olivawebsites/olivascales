/* ============================================================
   OLIVASCALES — script.js  (v2 — Mentorship / Course focus)
   ============================================================ */

/* ---------- STARLIGHT CANVAS ---------- */
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

  const stars = Array.from({ length: 90 }, () => ({
    x:     Math.random(),
    y:     Math.random(),
    r:     Math.random() * 1.5 + 0.5,
    base:  Math.random() * 0.28 + 0.12,
    amp:   Math.random() * 0.18 + 0.06,
    phase: Math.random() * Math.PI * 2,
    freq:  Math.random() * 0.011 + 0.003,
    vx:    (Math.random() - 0.5) * 0.035,
    vy:    (Math.random() - 0.5) * 0.035,
    hero:  false,
  }));

  const heroStars = Array.from({ length: 7 }, () => ({
    x:     Math.random(),
    y:     Math.random(),
    r:     Math.random() * 1.5 + 2.0,
    base:  Math.random() * 0.2  + 0.35,
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
      s.x += s.vx / W;
      s.y += s.vy / H;
      if (s.x < 0) s.x = 1; else if (s.x > 1) s.x = 0;
      if (s.y < 0) s.y = 1; else if (s.y > 1) s.y = 0;

      const alpha = Math.max(0, s.base + Math.sin(frame * s.freq + s.phase) * s.amp);

      if (s.hero) {
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
  const logo     = intro.querySelector('.intro-logo');
  const title    = intro.querySelector('.intro-title');
  const subtitle = intro.querySelector('.intro-subtitle');
  const progress = intro.querySelector('.intro-progress-fill');
  const enterBtn = document.getElementById('intro-enter-btn');
  const clouds   = intro.querySelectorAll('.intro-cloud');
  const body     = document.body;

  body.style.overflow = 'hidden';

  const stopStarlight = initStarlightCanvas();

  const onMouseMove = (e) => {
    const mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;
    clouds.forEach(cloud => {
      const px = parseFloat(cloud.style.getPropertyValue('--cpx') || 0.8);
      const py = parseFloat(cloud.style.getPropertyValue('--cpy') || 0.35);
      cloud.style.setProperty('--px', (mx * px * 28) + 'px');
      cloud.style.setProperty('--py', (my * py * 12) + 'px');
    });
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  setTimeout(() => { if (progress) progress.classList.add('loaded'); }, 300);
  setTimeout(() => { if (logo) logo.classList.add('visible'); }, 700);
  setTimeout(() => { if (title) title.classList.add('visible'); }, 1500);
  setTimeout(() => { if (subtitle) subtitle.classList.add('visible'); }, 2200);
  setTimeout(() => { if (enterBtn) enterBtn.classList.add('visible'); }, 3000);

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      enterBtn.style.pointerEvents = 'none';
      window.removeEventListener('mousemove', onMouseMove);
      intro.classList.add('fade-out');
      body.style.overflow = '';
      setTimeout(() => {
        if (stopStarlight) stopStarlight();
        intro.remove();
        triggerHeroEntrance();
      }, 1100);
    });
  }
}

/* ---------- HERO ENTRANCE ---------- */
function triggerHeroEntrance() {
  document.querySelectorAll('.hero-animate').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 130);
  });
}

/* ---------- NAVBAR ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ---------- MOBILE MENU ---------- */
function initMobileMenu() {
  const toggle    = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('nav-mobile');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- SCROLL ANIMATIONS ---------- */
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.fade-up, .fade-in, .story-chapter, .story-quote, .merch-card, .unlock-card, .teaser-card'
  );

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}

/* ---------- SMOOTH SCROLL ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---------- APPLICATION FORM ---------- */
function initApplyForm() {
  const form    = document.getElementById('apply-form');
  const success = document.getElementById('form-success');
  const submit  = form ? form.querySelector('.form-submit') : null;

  if (!form) return;

  if (window.location.search.includes('applied=true') && success) {
    success.style.display = 'block';
    form.style.display = 'none';
    const applySection = document.getElementById('apply');
    if (applySection) {
      setTimeout(() => applySection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
    }
  }

  form.addEventListener('submit', (e) => {
    const requiredFields = form.querySelectorAll('[required]');
    let allValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        allValid = false;
        field.style.borderColor = 'rgba(255,80,80,0.5)';
        field.addEventListener('input', () => {
          field.style.borderColor = '';
        }, { once: true });
      }
    });

    if (!allValid) {
      e.preventDefault();
      const firstEmpty = Array.from(requiredFields).find(f => !f.value.trim());
      if (firstEmpty) firstEmpty.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (submit) {
      submit.textContent = 'Sending...';
      submit.style.opacity = '0.6';
      submit.style.pointerEvents = 'none';
    }
  });
}

/* ---------- MERCH NOTIFY FORM ---------- */
function initNotifyForm() {
  const form    = document.getElementById('notify-form');
  const input   = document.getElementById('notify-email');
  const success = document.getElementById('notify-success');
  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.animation = 'none';
      input.offsetHeight;
      input.style.animation = 'shake 0.4s ease';
      return;
    }
    console.log('Merch notify signup:', email);
    form.style.opacity = '0.3';
    form.style.pointerEvents = 'none';
    if (success) success.style.display = 'block';
    input.value = '';
  });
}

/* ---------- PARALLAX ---------- */
function initParallax() {
  const grid = document.querySelector('.hero-grid');
  const glow = document.querySelector('.hero-glow');
  if (!grid && !glow) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (grid) grid.style.transform = `translateY(${y * 0.15}px)`;
    if (glow) glow.style.transform = `translate(-50%, calc(-50% + ${y * 0.1}px))`;
  }, { passive: true });
}

/* ---------- CURSOR GLOW ---------- */
function initCursorGlow() {
  if (window.innerWidth < 960) return;
  const cursor = document.createElement('div');
  cursor.style.cssText = `position:fixed;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,0.04) 0%,transparent 70%);pointer-events:none;z-index:0;transform:translate(-50%,-50%);transition:opacity 0.3s ease;opacity:0;`;
  document.body.appendChild(cursor);
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    cursor.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
}

/* ---------- ACTIVE NAV LINK ---------- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
}

/* ---------- INJECT KEYFRAMES ---------- */
function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }
  `;
  document.head.appendChild(style);
}

/* ---------- BOOT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  injectKeyframes();
  runIntro();
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initSmoothScroll();
  initApplyForm();
  initNotifyForm();
  initParallax();
  initCursorGlow();
  initActiveNav();
});
