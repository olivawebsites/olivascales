/* ============================================================
   OLIVASCALES — script.js  (v2)
   ============================================================ */

function runIntro() {
  const intro    = document.getElementById('intro-screen');
  const logo     = document.querySelector('.intro-logo');
  const title    = document.querySelector('.intro-title');
  const subtitle = document.querySelector('.intro-subtitle');
  const progress = document.querySelector('.intro-progress-fill');
  const body     = document.body;

  body.style.overflow = 'hidden';
  setTimeout(() => logo.classList.add('visible'), 300);
  setTimeout(() => title.classList.add('visible'), 900);
  setTimeout(() => subtitle.classList.add('visible'), 1300);
  setTimeout(() => progress.classList.add('loaded'), 600);
  setTimeout(() => {
    intro.classList.add('fade-out');
    body.style.overflow = '';
    setTimeout(() => { intro.remove(); triggerHeroEntrance(); }, 900);
  }, 3000);
}

function triggerHeroEntrance() {
  document.querySelectorAll('.hero-animate').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 130);
  });
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

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

function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.fade-up, .fade-in, .story-chapter, .story-quote, .merch-card, .unlock-card, .teaser-card'
  );
  if (!('IntersectionObserver' in window)) { targets.forEach(el => el.classList.add('visible')); return; }
  const observer = new IntersectionObserver(
    (entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }); },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  targets.forEach(el => observer.observe(el));
}

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

function initApplyForm() {
  const form    = document.getElementById('apply-form');
  const success = document.getElementById('form-success');
  const submit  = form ? form.querySelector('.form-submit') : null;
  if (!form) return;

  if (window.location.search.includes('applied=true') && success) {
    success.style.display = 'block';
    form.style.display = 'none';
    const applySection = document.getElementById('apply');
    if (applySection) setTimeout(() => applySection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
  }

  form.addEventListener('submit', (e) => {
    const requiredFields = form.querySelectorAll('[required]');
    let allValid = true;
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        allValid = false;
        field.style.borderColor = 'rgba(255,80,80,0.5)';
        field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
      }
    });
    if (!allValid) {
      e.preventDefault();
      const firstEmpty = Array.from(requiredFields).find(f => !f.value.trim());
      if (firstEmpty) firstEmpty.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (submit) { submit.textContent = 'Sending...'; submit.style.opacity = '0.6'; submit.style.pointerEvents = 'none'; }
  });
}

function initNotifyForm() {
  const form    = document.getElementById('notify-form');
  const input   = document.getElementById('notify-email');
  const success = document.getElementById('notify-success');
  if (!form || !input) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.animation = 'none'; input.offsetHeight; input.style.animation = 'shake 0.4s ease';
      return;
    }
    form.style.opacity = '0.3'; form.style.pointerEvents = 'none';
    if (success) success.style.display = 'block';
    input.value = '';
  });
}

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

function initCursorGlow() {
  if (window.innerWidth < 960) return;
  const cursor = document.createElement('div');
  cursor.style.cssText = `position:fixed;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,0.04) 0%,transparent 70%);pointer-events:none;z-index:0;transform:translate(-50%,-50%);transition:opacity 0.3s ease;opacity:0;`;
  document.body.appendChild(cursor);
  document.addEventListener('mousemove', (e) => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; cursor.style.opacity = '1'; });
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
}

function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }`;
  document.head.appendChild(style);
}

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
});
