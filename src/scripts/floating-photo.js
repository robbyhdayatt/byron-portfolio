import gsap from 'gsap';

export function init(prefersReducedMotion) {
  const wrapper = document.querySelector('.floating-photo-wrapper');
  if (!wrapper) return;

  if (prefersReducedMotion) {
    gsap.set(wrapper, { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(wrapper,
    { opacity: 0, y: 30 },
    { 
      opacity: 1, y: 0, duration: 1, ease: 'power2.out',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 80%',
      },
      onComplete: () => {
        gsap.to(wrapper, {
          y: -12,
          duration: 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
      }
    }
  );
}
