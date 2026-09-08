/**
 * preloader.js — Byron Portfolio Sky Takeoff Sequence
 * Silky-smooth entrance, elegant letter reveal without clipping,
 * and a luxurious, cinematic dissolve transition into the hero landing page.
 */
import gsap from 'gsap';

export function init(prefersReducedMotion) {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  // Show body immediately
  document.body.classList.add('ready');

  if (prefersReducedMotion) {
    preloader.remove();
    document.body.style.overflow = '';
    return;
  }

  document.body.style.overflow = 'hidden';

  const letters = preloader.querySelectorAll('.preloader-letter');
  const plane = preloader.querySelector('.preloader-plane');
  const contrail = preloader.querySelector('.preloader-contrail');
  const clouds = preloader.querySelectorAll('.preloader-cloud');
  const sunGlow = preloader.querySelector('.preloader-sun-glow');
  const glints = preloader.querySelectorAll('.preloader-glint');

  // Initial Setup: Set smooth initial resting states
  gsap.set(preloader, { opacity: 1 });
  
  if (sunGlow) gsap.set(sunGlow, { opacity: 0, scale: 0.85 });
  if (clouds.length) gsap.set(clouds, { opacity: 0, scale: 0.92 });
  if (plane) gsap.set(plane, { x: -75, y: 55, opacity: 0, scale: 0.8 });
  if (contrail) gsap.set(contrail, { opacity: 0 });
  if (glints.length) gsap.set(glints, { opacity: 0, scale: 0 });

  letters.forEach((letter) => {
    gsap.set(letter, {
      y: 36,
      opacity: 0,
      scale: 0.94,
      filter: 'blur(8px)'
    });
  });

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      preloader.remove();
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('preloaderComplete'));
    }
  });

  // 1. Silky Ambient Sky Fade-In (0.0s – 1.0s)
  if (sunGlow) {
    tl.to(sunGlow, { opacity: 0.9, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
  }
  if (clouds.length) {
    tl.to(clouds, { opacity: (i) => (i === 0 ? 0.85 : 0.75), scale: 1, duration: 1.2, ease: 'power2.out', stagger: 0.15 }, 0.05);
  }

  // 2. Paper Plane & Contrail Glides into View (0.15s – 1.3s)
  if (plane) {
    tl.to(plane, { x: 0, y: 0, opacity: 1, scale: 1, duration: 1.3, ease: 'power3.out' }, 0.15);
  }
  if (contrail) {
    tl.to(contrail, { opacity: 1, duration: 1.1, ease: 'power2.out' }, 0.25);
  }
  if (glints.length) {
    tl.to(glints, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2)', stagger: 0.2 }, 0.3);
  }

  // 3. Name Letters Fluid Wave Reveal (0.25s – 1.3s)
  tl.to(letters, {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    duration: 1.05,
    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    stagger: 0.042
  }, 0.25);

  // 4. Harmonic Weightless Floating Breath (1.2s – 1.9s)
  tl.to(letters, {
    y: (i) => Math.sin(i * 0.6) * 4 - 3,
    duration: 0.7,
    ease: 'sine.inOut',
    stagger: {
      each: 0.03,
      yoyo: true,
      repeat: 1
    }
  }, '+=0.15');

  // 5. Plane Ascends Smoothly into Blue Sky (1.9s – 2.7s)
  if (plane) {
    tl.to(plane, {
      x: 160,
      y: -130,
      scale: 1.18,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.in'
    }, '-=0.2');
  }

  // 6. Name Letters Dissolve Gracefully into Morning Mist (2.0s – 2.7s)
  tl.to(letters, {
    y: -28,
    opacity: 0,
    scale: 1.03,
    filter: 'blur(8px)',
    duration: 0.75,
    ease: 'power3.inOut',
    stagger: 0.025
  }, '<+=0.05');

  // Dissolve clouds and sky sparkles
  if (clouds.length) {
    tl.to(clouds, { opacity: 0, scale: 1.08, duration: 0.65, ease: 'power2.inOut' }, '<');
  }
  if (sunGlow) {
    tl.to(sunGlow, { opacity: 0, scale: 1.15, duration: 0.65, ease: 'power2.inOut' }, '<');
  }
  if (contrail) {
    tl.to(contrail, { opacity: 0, duration: 0.45, ease: 'power2.in' }, '<');
  }

  // 7. Seamless Dissolve Transition of Preloader into Landing Page (2.2s – 2.9s)
  tl.to(preloader, {
    opacity: 0,
    scale: 1.04,
    filter: 'blur(4px)',
    duration: 0.8,
    ease: 'power2.inOut'
  }, '-=0.45');

  // 8. Coordinated Hero Elements Entrance Animation (Synchronized with Dissolve)
  tl.add(() => {
    const heroElements = document.querySelectorAll(
      '.hero-greeting, .hero-big-name, .hero-tagline, .tech-badge-container, .sky-airplane-hero, .side-nav'
    );
    if (heroElements.length) {
      gsap.fromTo(heroElements,
        { opacity: 0, y: 28, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.95,
          ease: 'power3.out',
          stagger: 0.08
        }
      );
    }
  }, '-=0.55');
}
