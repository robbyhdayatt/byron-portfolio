import gsap from 'gsap';

export function init(prefersReducedMotion) {
  const clouds = document.querySelectorAll('.cloud');
  
  if (prefersReducedMotion) {
    return;
  }

  clouds.forEach(cloud => {
    const speedAttr = cloud.getAttribute('data-speed');
    let speed = 0.5;
    if (speedAttr === 'slow') speed = 0.3;
    if (speedAttr === 'fast') speed = 0.7;

    gsap.to(cloud, {
      y: () => (document.documentElement.scrollHeight - window.innerHeight) * speed,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });
  });

  gsap.to(document.documentElement, {
    "--scroll-progress": 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true
    }
  });
}
