/**
 * idcard.js — High Performance 60/120fps Realistic Woven Lanyard & Badge Physics Engine
 * Zero-lag real-time SVG ribbon tension stretching & unified single-phase elastic snap-back.
 */
import gsap from 'gsap';

export function init(prefersReducedMotion) {
  const card = document.getElementById('tech-badge');
  const pathLeft = document.getElementById('lanyard-path-left');
  const stitchLeft1 = document.getElementById('lanyard-stitch-left-1');
  const stitchLeft2 = document.getElementById('lanyard-stitch-left-2');

  const pathRight = document.getElementById('lanyard-path-right');
  const stitchRight1 = document.getElementById('lanyard-stitch-right-1');
  const stitchRight2 = document.getElementById('lanyard-stitch-right-2');

  const clipGroup = document.getElementById('lanyard-clip-group');
  const shimmer = document.querySelector('.badge-hologram-glow');
  const hero = document.querySelector('#hero');

  if (!card) return;

  // Lanyard SVG Geometry Constants (500x200 ViewBox)
  const TOP_L_X = 160;
  const TOP_R_X = 340;
  const TOP_Y = -40;
  const REST_CLIP_X = 250;
  const REST_CLIP_Y = 158;

  // Core Physics State
  const state = {
    x: 0,
    y: 0,
    rot: -2.5
  };

  let isDragging = false;
  let isSpringing = false;
  let currentTween = null;

  // Fast direct renderer (zero layout thrashing)
  function render() {
    const { x, y, rot } = state;

    // 1. Transform Badge Card
    card.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;

    // 2. Compute SVG dynamic bezier curves for woven ribbon straps
    const clipX = REST_CLIP_X + x;
    const clipY = REST_CLIP_Y + y;

    const cpLeftX = (TOP_L_X + clipX - 6) * 0.5 + (x * 0.12);
    const cpLeftY = (TOP_Y + clipY) * 0.5 + 14;

    const cpRightX = (TOP_R_X + clipX + 6) * 0.5 + (x * 0.12);
    const cpRightY = (TOP_Y + clipY) * 0.5 + 14;

    const dL = `M ${TOP_L_X} ${TOP_Y} Q ${cpLeftX} ${cpLeftY} ${clipX - 6} ${clipY}`;
    const dR = `M ${TOP_R_X} ${TOP_Y} Q ${cpRightX} ${cpRightY} ${clipX + 6} ${clipY}`;

    if (pathLeft) pathLeft.setAttribute('d', dL);
    if (stitchLeft1) stitchLeft1.setAttribute('d', dL);
    if (stitchLeft2) stitchLeft2.setAttribute('d', dL);

    if (pathRight) pathRight.setAttribute('d', dR);
    if (stitchRight1) stitchRight1.setAttribute('d', dR);
    if (stitchRight2) stitchRight2.setAttribute('d', dR);

    if (clipGroup) {
      clipGroup.setAttribute('transform', `translate(${clipX}, ${clipY}) rotate(${rot * 0.7})`);
    }

    if (shimmer) {
      shimmer.style.transform = `rotate(25deg) translate3d(${(x / 200) * 45}px, 0, 0)`;
    }
  }

  // Initial draw
  render();

  if (prefersReducedMotion) {
    return;
  }

  // 1. Entrance Drop Animation
  isSpringing = true;
  state.y = -120;
  state.rot = 14;
  render();

  currentTween = gsap.to(state, {
    x: 0,
    y: 0,
    rot: -2.5,
    duration: 1.6,
    ease: 'elastic.out(1, 0.42)',
    delay: 0.4,
    onUpdate: render,
    onComplete: () => {
      isSpringing = false;
    }
  });

  // 2. Ultra-Smooth Pointer Dragging
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  let vx = 0;
  let vy = 0;

  card.style.cursor = 'grab';
  card.style.touchAction = 'none';

  function onPointerDown(e) {
    if (e.target.closest('a') || e.target.closest('button')) return;

    isDragging = true;
    isSpringing = false;
    card.style.cursor = 'grabbing';

    if (currentTween) {
      currentTween.kill();
      currentTween = null;
    }

    startX = e.clientX - state.x;
    startY = e.clientY - state.y;
    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = performance.now();
    vx = 0;
    vy = 0;

    try {
      card.setPointerCapture(e.pointerId);
    } catch (_) {}

    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!isDragging) return;

    const now = performance.now();
    const dt = Math.max(now - lastTime, 1);

    const rawX = e.clientX - startX;
    const rawY = e.clientY - startY;

    // Elastic rubber tension formula (smooth logarithmic resistance)
    const dist = Math.hypot(rawX, rawY);
    const tension = 1 / (1 + dist * 0.0018);

    state.x = rawX * tension;
    state.y = Math.max(-50, rawY * tension);
    state.rot = Math.max(-28, Math.min(28, -2.5 + (state.x * 0.075)));

    vx = ((e.clientX - lastX) / dt) * 16;
    vy = ((e.clientY - lastY) / dt) * 16;

    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = now;

    render();
    e.preventDefault();
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    isSpringing = true;
    card.style.cursor = 'grab';

    try {
      card.releasePointerCapture(e.pointerId);
    } catch (_) {}

    // Clamp throw velocity
    const maxV = 28;
    vx = Math.max(-maxV, Math.min(maxV, vx));
    vy = Math.max(-maxV, Math.min(maxV, vy));

    // Single unified seamless elastic snap-back
    state.x += vx * 1.5;
    state.y += vy * 1.5;
    state.rot += (vx * 0.04);
    render();

    currentTween = gsap.to(state, {
      x: 0,
      y: 0,
      rot: -2.5,
      duration: 1.4,
      ease: 'elastic.out(1, 0.32)',
      onUpdate: render,
      onComplete: () => {
        isSpringing = false;
        currentTween = null;
      }
    });
  }

  card.addEventListener('pointerdown', onPointerDown);
  card.addEventListener('pointermove', onPointerMove);
  card.addEventListener('pointerup', onPointerUp);
  card.addEventListener('pointercancel', onPointerUp);

  // 3. Subtle Parallax Hover when Idle
  if (hero && window.innerWidth >= 768) {
    hero.addEventListener('mousemove', (e) => {
      if (isDragging || isSpringing) return;

      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const diffX = e.clientX - cardCenterX;

      const targetRot = -2.5 + (diffX / window.innerWidth) * 5.5;
      const targetX = (diffX / window.innerWidth) * 14;

      if (currentTween) currentTween.kill();

      currentTween = gsap.to(state, {
        x: targetX,
        rot: targetRot,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: render,
        onComplete: () => {
          currentTween = null;
        }
      });
    });

    hero.addEventListener('mouseleave', () => {
      if (isDragging || isSpringing) return;

      if (currentTween) currentTween.kill();

      currentTween = gsap.to(state, {
        x: 0,
        y: 0,
        rot: -2.5,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: render,
        onComplete: () => {
          currentTween = null;
        }
      });
    });
  }
}
