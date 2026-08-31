/**
 * preloader.js — "Robby Hidayat" Sky & Aviation Takeoff Sequence
 * Letters float in like morning clouds, the supersonic paper plane ascends,
 * and the preloader seamlessly dissolves into the main portfolio.
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
  const runway = preloader.querySelector('.preloader-runway');
  const plane = preloader.querySelector('.preloader-plane');
  const clouds = preloader.querySelectorAll('.preloader-cloud');

  const tl = gsap.timeline({
    onComplete: () => {
      preloader.remove();
      document.body.style.overflow = '';
    }
  });

  // Initial State: Letters scattered softly like clouds
  letters.forEach((letter) => {
    const randomX = (Math.random() - 0.5) * 160;
    const randomY = (Math.random() - 0.5) * 80 + 35;
    const randomRotate = (Math.random() - 0.5) * 25;

    gsap.set(letter, {
      x: randomX,
      y: randomY,
      opacity: 0,
      rotate: randomRotate,
      scale: 0.7,
      filter: 'blur(8px)'
    });
  });

  if (runway) gsap.set(runway, { opacity: 0, scaleX: 0.7 });
  if (plane) gsap.set(plane, { x: -60, y: 50, opacity: 0 });
  if (clouds) gsap.set(clouds, { opacity: 0, scale: 0.9 });

  // 1. Fade in clouds and ambient sky
  tl.to(clouds, {
    opacity: (i) => (i === 0 ? 0.85 : 0.7),
    scale: 1,
    duration: 1.0,
    ease: 'power2.out',
    stagger: 0.15
  }, 0.1);

  // 2. Plane & Runway Entrance
  if (plane) {
    tl.to(plane, { x: 0, y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.25);
  }
  if (runway) {
    tl.to(runway, { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power2.out' }, 0.3);
  }

  // 3. Stagger letters floating into place
  tl.to(letters, {
    x: 0,
    y: 0,
    opacity: 1,
    rotate: 0,
    scale: 1,
    filter: 'blur(0px)',
    duration: 1.1,
    ease: 'power2.out',
    stagger: {
      each: 0.05,
      from: 'random'
    }
  }, 0.35);

  // 4. Gentle harmonic float
  tl.to(letters, {
    y: (i) => Math.sin(i * 0.7) * 5,
    duration: 0.8,
    ease: 'sine.inOut',
    stagger: 0.03
  }, '+=0.2');

  // 5. Plane accelerates and letters scatter upward like dissolving into clouds
  if (plane) {
    tl.to(plane, {
      x: 120,
      y: -100,
      opacity: 0,
      scale: 1.2,
      duration: 0.8,
      ease: 'power2.in'
    }, '+=0.1');
  }

  tl.to(letters, {
    y: (i) => -(40 + Math.random() * 70),
    x: (i) => (Math.random() - 0.5) * 150,
    opacity: 0,
    scale: 1.2,
    filter: 'blur(10px)',
    duration: 0.8,
    ease: 'power2.in',
    stagger: {
      each: 0.03,
      from: 'center'
    }
  }, '<');

  if (runway) tl.to(runway, { opacity: 0, duration: 0.4, ease: 'power2.in' }, '<');

  // 6. Seamless dissolve of preloader into Hero
  tl.to(preloader, {
    opacity: 0,
    scale: 1.04,
    duration: 0.5,
    ease: 'power2.out'
  }, '-=0.3');
}
