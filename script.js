/* ---------- INTRO SCREEN ---------- */
function runIntro() {
  const intro    = document.getElementById('intro-screen');
  const scene    = intro ? intro.querySelector('.intro-scene') : null;
  const seam     = intro.querySelector('.intro-gate-seam');
  const gateSVGs = intro ? intro.querySelectorAll('.gate-svg') : [];
  const logo     = intro ? intro.querySelector('.intro-logo') : null;
  const title    = intro ? intro.querySelector('.intro-title') : null;
  const subtitle = intro ? intro.querySelector('.intro-subtitle') : null;
  const progress = intro ? intro.querySelector('.intro-progress-fill') : null;
  const enterBtn = intro ? intro.querySelector('.intro-enter') : null;
  const gateL    = intro.querySelector('.intro-gate-left');
  const gateR    = intro.querySelector('.intro-gate-right');

  document.body.style.overflow = 'hidden';

  /* ── 1. Gates appear ── */
  setTimeout(() => {
    gateSVGs.forEach(svg => svg.classList.add('visible'));
  }, 180);

  /* ── 2. Seam glow appears ── */
  setTimeout(() => {
    if (seam) seam.classList.add('visible');
  }, 300);

  /* ── 3. Stars canvas starts ── */
  initStarCanvas();

  /* ── 4. Scene begins 3D approach (clouds + gates move toward viewer) ── */
  setTimeout(() => {
    if (scene) scene.classList.add('approach');
  }, 350);

  /* ── 5. Progress bar loads during the approach ── */
  setTimeout(() => {
    if (progress) progress.classList.add('loaded');
  }, 600);

  /* ── 6. Seam fades just before gates open ── */
  setTimeout(() => {
    if (seam) seam.classList.add('fading');
  }, 3000);

  /* ── 7. Gates swing open ── */
  setTimeout(() => {
    if (gateL) gateL.classList.add('open');
    if (gateR) gateR.classList.add('open');
  }, 3200);

  /* ── 8. Logo spins in ── */
  setTimeout(() => {
    if (logo) logo.classList.add('visible');
  }, 4400);

  /* ── 9. Title ── */
  setTimeout(() => {
    if (title) title.classList.add('visible');
  }, 5000);

  /* ── 10. Subtitle ── */
  setTimeout(() => {
    if (subtitle) subtitle.classList.add('visible');
  }, 5500);

  /* ── 11. Step Inside button ── */
  setTimeout(() => {
    if (enterBtn) enterBtn.classList.add('visible');
  }, 6100);
}
