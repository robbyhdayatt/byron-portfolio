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
import { init as initSkillsMarquee } from './skills-marquee.js';
import { init as initContactForm } from './contact-form.js';
import { init as initI18n, applyTranslations } from './i18n.js';
import { renderPersonal, renderProjects, renderTimeline, renderSkills } from './render.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', async () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Show body
  document.body.classList.add('ready');

  // Initialize i18n (language system)
  initI18n();

  // Initialize Lenis smooth scroll
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // 1. Render all dynamic content first and wait for completion
  await Promise.all([
    renderPersonal(),
    renderSkills(),
    renderProjects(),
    renderTimeline(),
    initCertifications(prefersReducedMotion)
  ]);

  // Apply translations to dynamically inserted elements (timeline, etc.)
  applyTranslations();

  // Re-run renderPersonal on language switch if necessary
  window.addEventListener('langchange', () => {
    renderPersonal();
  });

  // 2. Initialize scroll reveal AFTER all dynamic elements are in the DOM
  initScrollReveal(prefersReducedMotion);

  // Refresh ScrollTrigger positions after all content has been rendered
  ScrollTrigger.refresh();

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

  // ===================================
  // Floating Back to Top Button (Fly to Top)
  // ===================================
  const backToTopBtn = document.querySelector('#back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      lenis.scrollTo(0, { duration: 1.2 });
    });
  }

  // Initialize remaining animation modules
  initPreloader(prefersReducedMotion);
  initIdCard(prefersReducedMotion);
  initFloatingPhoto(prefersReducedMotion);
  initSkyBackground(prefersReducedMotion);
  initSkillsMarquee(prefersReducedMotion);
  initContactForm();
});
