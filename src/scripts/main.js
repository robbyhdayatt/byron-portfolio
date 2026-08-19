import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import '../styles/base.css';
import '../styles/components.css';
import '../styles/sections.css';

import { init as initPreloader } from './preloader.js';
import { init as initIdCard } from './idcard.js';
import { init as initFloatingPhoto } from './floating-photo.js';
import { init as initSkyBackground } from './sky-background.js';
import { init as initScrollReveal } from './scroll-reveal.js';
import { init as initCertifications } from './certifications.js';
import { init as initContactForm } from './contact-form.js';
import { init as initI18n } from './i18n.js';
import { renderProjects, renderTimeline } from './render.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Show body (was hidden by inline critical CSS to prevent FOUC)
  document.body.classList.add('ready');

  // Initialize i18n (language system)
  initI18n();

  // Render dynamic content
  renderProjects();
  renderTimeline();

  // Initialize Lenis smooth scroll
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ===================================
  // Side dot navigation — active state
  // ===================================
  const sideNavDots = document.querySelectorAll('.side-nav-dot');
  const sections = document.querySelectorAll('section[id]');

  if (sideNavDots.length && sections.length) {
    // Use ScrollTrigger to track active section
    sections.forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => updateActiveDot(section.id),
        onEnterBack: () => updateActiveDot(section.id),
      });
    });

    function updateActiveDot(sectionId) {
      sideNavDots.forEach(dot => {
        dot.classList.toggle('active', dot.dataset.section === sectionId);
      });
    }
  }

  // ===================================
  // Scroll indicator hide on scroll
  // ===================================
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom center',
      onLeave: () => gsap.to(scrollIndicator, { opacity: 0, duration: 0.3 }),
      onEnterBack: () => gsap.to(scrollIndicator, { opacity: 1, duration: 0.3 }),
    });
  }

  // Initialize animation modules
  initPreloader(prefersReducedMotion);
  initIdCard(prefersReducedMotion);
  initFloatingPhoto(prefersReducedMotion);
  initSkyBackground(prefersReducedMotion);
  initScrollReveal(prefersReducedMotion);
  initCertifications(prefersReducedMotion);
  initContactForm();
});
