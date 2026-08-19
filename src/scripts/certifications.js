import gsap from 'gsap';
import { certifications as fallbackCerts } from '../data/content.js';

export async function init(prefersReducedMotion) {
  const grid = document.querySelector('#certs-grid');
  const overlay = document.querySelector('.modal-overlay');
  
  if (!grid) return;

  let certList = fallbackCerts;
  try {
    const res = await fetch('./admin/content.json?v=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (data && data.certifications) certList = data.certifications;
    }
  } catch (e) {
    console.log('Using static certs fallback');
  }

  if (certList) {
    grid.innerHTML = certList.map((cert, index) => `
      <div class="cert-card reveal" data-index="${index}" tabindex="0" role="button">
        <h3>${cert.title}</h3>
        <p>${cert.issuer}</p>
        <span>${cert.year}</span>
      </div>
    `).join('');
  }

  const cards = document.querySelectorAll('.cert-card');
  const modalContentWrapper = overlay ? overlay.querySelector('.modal-content') : null;

  if (!overlay || !modalContentWrapper) return;

  const openModal = (index) => {
    const cert = certList[index];
    if (!cert) return;

    modalContentWrapper.innerHTML = `
      <button class="modal-close" aria-label="Close modal">&times;</button>
      <h2>${cert.title}</h2>
      <p><strong>Issuer:</strong> ${cert.issuer}</p>
      <p><strong>Year:</strong> ${cert.year}</p>
      ${cert.description ? `<p>${cert.description}</p>` : ''}
    `;

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (!prefersReducedMotion) {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(modalContentWrapper, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' });
    } else {
      gsap.set(overlay, { opacity: 1 });
      gsap.set(modalContentWrapper, { scale: 1, opacity: 1 });
    }
  };

  const closeModal = () => {
    if (!prefersReducedMotion) {
      gsap.to(modalContentWrapper, { scale: 0.9, opacity: 0, duration: 0.2 });
      gsap.to(overlay, { opacity: 0, duration: 0.2, onComplete: () => {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      }});
    } else {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  cards.forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.index));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.index);
      }
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('modal-close')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.style.display === 'flex') {
      closeModal();
    }
  });
}
