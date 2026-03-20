/* ============================================================
   OLIVASCALES — script.js  (v2 — Mentorship / Course focus)
   ============================================================ */

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

/* ---------- INTRO SCREEN — v5 "Gates of Heaven" ---------- */
function runIntro() {
  const intro    = document.getElementById('intro-screen');
  const scene    = intro.querySelector('.intro-scene');
  const seam     = intro.querySelector('.intro-gate-seam');
  const gateSVGs = intro.querySelectorAll('.gate-svg');
  const logo     = intro.querySelector('.intro-logo');
  const title    = intro.querySelector('.intro-title');
  const subtitle = intro.querySelector('.intro-subtitle');
  const progress = intro.querySelector('.intro-progress-fill');
  const enterBtn = document.getElementById('intro-enter-btn');
  const gateL    = intro.querySelector('.intro-gate-left');
  const gateR    = intro.querySelector('.intro-gate-right');
  const body     = document.body;

  body.style.overflow = 'hidden';

  /* ── 1. Stars (always behind everything, z:0 in intro-screen) ── */
  const stopStarlight = initStarlightCanvas();

  /* ── 2. Reveal gate SVG art after a short settle ── */
  setTimeout(() => {
    gateSVGs.forEach(svg => svg.classList.add('visible'));
  }, 180);

  /* ── 3. Seam glow appears — gates look sealed ── */
  setTimeout(() => {
    if (seam) seam.classList.add('visible');
  }, 300);

  /* ── 4. Scene begins 3D approach (clouds + gates move toward viewer) ── */
  setTimeout(() => {
    if (scene) scene.classList.add('approach');
  }, 350);

  /* ── 5. Progress bar loads during the approach ── */
  setTimeout(() => {
    if (progress) progress.classList.add('loaded');
  }, 600);

  /* ── 6. Seam glow fades (gates about to open) ── */
  setTimeout(() => {
    if (seam) seam.classList.add('fading');
  }, 3000);

  /* ── 7. GATES OPEN — dramatic slide apart ── */
  setTimeout(() => {
    if (gateL) gateL.classList.add('open');
    if (gateR) gateR.classList.add('open');
  }, 3200);

  /* ── 8. Logo appears spinning (viewer has passed through) ── */
  setTimeout(() => {
    if (logo) logo.classList.add('visible');
  }, 4400);

  /* ── 9. Title fades up ── */
  setTimeout(() => {
    if (title) title.classList.add('visible');
  }, 5000);

  /* ── 10. Subtitle fades up ── */
  setTimeout(() => {
    if (subtitle) subtitle.classList.add('visible');
  }, 5500);

  /* ── 11. Step Inside button appears ── */
  setTimeout(() => {
    if (enterBtn) enterBtn.classList.add('visible');
  }, 6100);

  /* ── Manual enter — click triggers cinematic exit ── */
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      enterBtn.style.pointerEvents = 'none';
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

/* ---------- SMOOTH SCROLL (anchor links) ---------- */
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

/* ---------- APPLICATION FORM ----------
   HOW THIS WORKS:
   The form uses action="https://formspree.io/f/YOUR_FORM_ID" by default.

   TO ACTIVATE IT:
   1. Go to https://formspree.io and sign up (free)
   2. Create a new form and enter olivascales@gmail.com as the recipient
   3. Copy the form ID they give you (looks like "xpznkwrd")
   4. Open index.html and find the <form> tag
   5. Replace "YOUR_FORM_ID" with your actual ID
      Example: action="https://formspree.io/f/xpznkwrd"
   6. That's it — Formspree handles the email routing

   The code below adds a smooth success message instead of a page redirect.
   -------------------------------------------------------------------- */
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

/* ---------- PARALLAX (hero grid depth) ---------- */
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

/* ---------- CURSOR GLOW (desktop only) ---------- */
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
