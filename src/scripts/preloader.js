/**
 * preloader.js — "Robby Hidayat" floating cloud-like text preloader
 * Letters float in softly like clouds, then disperse to reveal the page.
 */
import gsap from 'gsap';

export function init(prefersReducedMotion) {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  // Show body immediately (was hidden by critical inline CSS)
  document.body.classList.add('ready');

  if (prefersReducedMotion) {
    preloader.remove();
    document.body.style.overflow = '';
    return;
  }

  document.body.style.overflow = 'hidden';

  const letters = preloader.querySelectorAll('.preloader-letter');
  
  const tl = gsap.timeline({
    onComplete: () => {
      preloader.remove();
      document.body.style.overflow = '';
    }
  });

  // Phase 1: Letters float in from random directions (like clouds drifting)
  letters.forEach((letter, i) => {
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 100 + 40;
    const randomRotate = (Math.random() - 0.5) * 30;
    
    gsap.set(letter, {
      x: randomX,
      y: randomY,
      opacity: 0,
      rotate: randomRotate,
      scale: 0.6,
      filter: 'blur(8px)'
    });
  });

  // Stagger letters floating into place
  tl.to(letters, {
    x: 0,
    y: 0,
    opacity: 1,
    rotate: 0,
    scale: 1,
    filter: 'blur(0px)',
    duration: 1.2,
    ease: 'power2.out',
    stagger: {
      each: 0.06,
      from: 'random'
    }
  }, 0.3);

  // Phase 2: Hold and gentle float
  tl.to(letters, {
    y: (i) => Math.sin(i * 0.8) * 6,
    duration: 0.8,
    ease: 'sine.inOut',
    stagger: 0.03
  }, '+=0.3');

  // Phase 3: Letters scatter upward like clouds dissolving
  tl.to(letters, {
    y: (i) => -(50 + Math.random() * 80),
    x: (i) => (Math.random() - 0.5) * 200,
    opacity: 0,
    scale: 1.3,
    filter: 'blur(12px)',
    duration: 0.9,
    ease: 'power2.in',
    stagger: {
      each: 0.04,
      from: 'center'
    }
  }, '+=0.2');

  // Phase 4: Fade out preloader background
  tl.to(preloader, {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out'
  }, '-=0.3');
}
