import gsap from 'gsap';

export function init(prefersReducedMotion) {
  const revealElements = document.querySelectorAll('.reveal');
  const revealGroups = document.querySelectorAll('.reveal-group');

  if (prefersReducedMotion) {
    revealElements.forEach(el => gsap.set(el, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }));
    return;
  }

  // Modern Blur-In + Scale + Slide Up Scroll Animation
  revealElements.forEach(el => {
    if (el.closest('.reveal-group')) return;

    gsap.fromTo(el,
      { opacity: 0, y: 45, scale: 0.96, filter: 'blur(8px)' },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Staggered reveal for cards & groups
  revealGroups.forEach(group => {
    const children = group.querySelectorAll('.reveal');
    if (children.length === 0) return;

    gsap.fromTo(children,
      { opacity: 0, y: 40, scale: 0.95, filter: 'blur(6px)' },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: group,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}
