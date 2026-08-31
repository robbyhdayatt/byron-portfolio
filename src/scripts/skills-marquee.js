/**
 * skills-marquee.js — Interactive Infinite Logo Marquee Engine
 * Seamless infinite auto-scrolling with manual touch swipe, mouse drag,
 * mouse wheel scroll, momentum inertia throw, and nav buttons.
 */
export function init(prefersReducedMotion) {
  const wrapper = document.getElementById('skills-marquee-wrapper');
  const track = document.getElementById('skills-marquee-track');
  const btnPrev = document.querySelector('.marquee-prev');
  const btnNext = document.querySelector('.marquee-next');

  if (!wrapper || !track) return;

  const firstGroup = track.querySelector('.marquee-group');
  if (!firstGroup) return;

  let groupWidth = firstGroup.offsetWidth || 1400;
  let currentX = -groupWidth;
  let autoSpeed = 0.85; // Natural auto-drift speed (moving right)
  let velocityX = 0;
  let isDragging = false;
  let isHovered = false;
  let lastX = 0;
  let lastTime = 0;

  function updateGroupWidth() {
    if (firstGroup) {
      groupWidth = firstGroup.offsetWidth || groupWidth;
    }
  }

  window.addEventListener('resize', updateGroupWidth);
  setTimeout(updateGroupWidth, 500);

  // Set initial position
  track.style.transform = `translate3d(${currentX}px, 0, 0)`;
  track.style.willChange = 'transform';

  // Continuous RAF loop
  function render() {
    if (!isDragging) {
      // 1. Inertia Momentum Throw
      if (Math.abs(velocityX) > 0.04) {
        currentX += velocityX;
        velocityX *= 0.93; // Inertia friction decay
      } else {
        velocityX = 0;
        // 2. Continuous Auto-Drift
        if (!isHovered && !prefersReducedMotion) {
          currentX += autoSpeed;
        } else if (isHovered && !prefersReducedMotion) {
          currentX += autoSpeed * 0.2; // Slow down gently on hover
        }
      }

      // 3. Infinite Seamless Wrapping
      while (currentX > 0) {
        currentX -= groupWidth;
      }
      while (currentX < -groupWidth * 2) {
        currentX += groupWidth;
      }

      track.style.transform = `translate3d(${currentX}px, 0, 0)`;
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  // Setup Drag & Touch Interactions
  wrapper.style.cursor = 'grab';
  wrapper.style.userSelect = 'none';
  wrapper.style.touchAction = 'pan-y';

  function onPointerDown(e) {
    isDragging = true;
    wrapper.style.cursor = 'grabbing';
    lastX = e.clientX;
    lastTime = performance.now();
    velocityX = 0;

    try {
      wrapper.setPointerCapture(e.pointerId);
    } catch (_) {}
  }

  function onPointerMove(e) {
    if (!isDragging) return;

    const now = performance.now();
    const dt = Math.max(now - lastTime, 1);
    const dx = e.clientX - lastX;

    currentX += dx;
    velocityX = (dx / dt) * 16;

    // Wrap during active dragging
    while (currentX > 0) currentX -= groupWidth;
    while (currentX < -groupWidth * 2) currentX += groupWidth;

    track.style.transform = `translate3d(${currentX}px, 0, 0)`;

    lastX = e.clientX;
    lastTime = now;
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    wrapper.style.cursor = 'grab';

    try {
      wrapper.releasePointerCapture(e.pointerId);
    } catch (_) {}

    // Clamp throw velocity
    velocityX = Math.max(-28, Math.min(28, velocityX));
  }

  wrapper.addEventListener('pointerdown', onPointerDown);
  wrapper.addEventListener('pointermove', onPointerMove);
  wrapper.addEventListener('pointerup', onPointerUp);
  wrapper.addEventListener('pointercancel', onPointerUp);

  wrapper.addEventListener('mouseenter', () => { isHovered = true; });
  wrapper.addEventListener('mouseleave', () => { isHovered = false; });

  // Mouse wheel horizontal scrolling
  wrapper.addEventListener('wheel', (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 2) {
      e.preventDefault();
      currentX -= delta * 0.7;
      velocityX = -delta * 0.18;

      while (currentX > 0) currentX -= groupWidth;
      while (currentX < -groupWidth * 2) currentX += groupWidth;

      track.style.transform = `translate3d(${currentX}px, 0, 0)`;
    }
  }, { passive: false });

  // Nav Arrow Buttons (Correct Natural Direction)
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      velocityX = 22; // Panah kiri: Menggeser untuk menampilkan item sebelah kiri
    });
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      velocityX = -22; // Panah kanan: Menggeser untuk menampilkan item sebelah kanan
    });
  }
}
