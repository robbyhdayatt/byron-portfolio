/**
 * idcard.js — Interactive draggable ID card with spring-back bounce
 * The card can be pulled/dragged and snaps back with elastic physics when released.
 */
import gsap from 'gsap';

export function init(prefersReducedMotion) {
  const card = document.querySelector('.boarding-pass');
  const hero = document.querySelector('#hero');
  if (!card) return;

  // Store resting position
  const restX = 0;
  const restY = 0;
  const restRotation = -3;

  // State tracking
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let velocityX = 0;
  let velocityY = 0;
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;

  if (prefersReducedMotion) {
    gsap.set(card, { x: restX, y: restY, rotation: restRotation });
    return;
  }

  // ===========================
  // Entrance animation
  // ===========================
  gsap.fromTo(card,
    { y: -150, rotation: 15, opacity: 0, scale: 0.8 },
    {
      y: restY,
      rotation: restRotation,
      opacity: 1,
      scale: 1,
      duration: 1.8,
      ease: 'elastic.out(1, 0.4)',
      delay: 0.8
    }
  );

  // ===========================
  // Make card draggable
  // ===========================
  card.style.cursor = 'grab';
  card.style.touchAction = 'none'; // prevent scroll on touch

  function onPointerDown(e) {
    if (e.target.closest('a')) return; // don't interfere with links
    
    isDragging = true;
    card.style.cursor = 'grabbing';
    
    // Kill any running spring animations
    gsap.killTweensOf(card);

    const point = e.touches ? e.touches[0] : e;
    startX = point.clientX - currentX;
    startY = point.clientY - currentY;
    lastX = point.clientX;
    lastY = point.clientY;
    lastTime = Date.now();

    card.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!isDragging) return;

    const point = e.touches ? e.touches[0] : e;
    const now = Date.now();
    const dt = Math.max(now - lastTime, 1);

    const newX = point.clientX - startX;
    const newY = point.clientY - startY;

    // Track velocity for throw effect
    velocityX = (point.clientX - lastX) / dt * 16; // normalize to ~60fps
    velocityY = (point.clientY - lastY) / dt * 16;

    lastX = point.clientX;
    lastY = point.clientY;
    lastTime = now;

    currentX = newX;
    currentY = newY;

    // Calculate rotation based on horizontal drag (tilts like a pendulum)
    const dragRotation = restRotation + (newX * 0.08);
    const clampedRotation = Math.max(-25, Math.min(25, dragRotation));

    // Apply with slight drag resistance at edges
    const resistance = 1 - Math.min(Math.abs(newX) / 600, 0.5);
    
    gsap.set(card, {
      x: newX * resistance + (newX * (1 - resistance) * 0.5),
      y: newY * resistance + (newY * (1 - resistance) * 0.5),
      rotation: clampedRotation,
      scale: 1.03 // slightly bigger while dragging
    });

    e.preventDefault();
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    card.style.cursor = 'grab';

    // Clamp velocity
    const maxVelocity = 30;
    velocityX = Math.max(-maxVelocity, Math.min(maxVelocity, velocityX));
    velocityY = Math.max(-maxVelocity, Math.min(maxVelocity, velocityY));

    // Calculate overshoot based on velocity (throw momentum)
    const overshootX = velocityX * 3;
    const overshootY = velocityY * 3;

    // Phase 1: Momentum overshoot
    gsap.to(card, {
      x: currentX + overshootX,
      y: currentY + overshootY,
      rotation: restRotation + overshootX * 0.05,
      duration: 0.25,
      ease: 'power2.out',
      onComplete: () => {
        // Phase 2: Spring back to rest with elastic bounce
        gsap.to(card, {
          x: restX,
          y: restY,
          rotation: restRotation,
          scale: 1,
          duration: 1.4,
          ease: 'elastic.out(1, 0.3)',
          onUpdate: function() {
            // Add subtle rotation wobble during spring-back
            const progress = this.progress();
            const wobble = Math.sin(progress * Math.PI * 6) * (1 - progress) * 3;
            // Already handled by elastic ease
          }
        });
      }
    });

    currentX = 0;
    currentY = 0;
  }

  // Bind events
  card.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  // ===========================
  // Subtle hover tilt (when not dragging)
  // ===========================
  if (hero) {
    const xTo = gsap.quickTo(card, 'rotation', { duration: 0.6, ease: 'power3' });

    hero.addEventListener('mousemove', (e) => {
      if (isDragging) return;
      
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const diffX = e.clientX - cardCenterX;
      
      const rotation = restRotation + (diffX / window.innerWidth) * 6;
      xTo(Math.max(-8, Math.min(2, rotation)));
    });

    hero.addEventListener('mouseleave', () => {
      if (!isDragging) {
        xTo(restRotation);
      }
    });
  }
}
