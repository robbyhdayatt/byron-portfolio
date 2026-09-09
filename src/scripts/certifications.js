import gsap from 'gsap';
import { certifications as fallbackCerts } from '../data/content.js';
import { fetchContent } from './github-cms.js';

function isPdf(url) {
  if (!url) return false;
  return url.toLowerCase().split('?')[0].endsWith('.pdf') || url.includes('.pdf');
}

export async function init(prefersReducedMotion) {
  const grid = document.querySelector('#certs-grid');
  const overlay = document.querySelector('.modal-overlay');
  
  if (!grid) return;

  let certList = fallbackCerts;
  try {
    const data = await fetchContent();
    if (data && data.certifications) certList = data.certifications;
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

    const isDocumentPdf = isPdf(cert.image);

    modalContentWrapper.innerHTML = `
      <div class="cert-modal-dialog">
        <button class="cert-modal-close" aria-label="Close modal">&times;</button>
        
        <div class="cert-modal-header">
          <div class="cert-modal-badges">
            <span class="cert-badge-issuer">${cert.issuer || 'Sertifikasi'}</span>
            <span class="cert-badge-year">${cert.year || ''}</span>
            ${isDocumentPdf ? '<span class="cert-badge-pdf-tag">📄 PDF Dokumen</span>' : ''}
          </div>
          <h2 class="cert-modal-title">${cert.title || ''}</h2>
        </div>

        <div class="cert-modal-media">
          ${cert.image ? (
            isDocumentPdf ? `
              <div class="cert-pdf-frame-wrapper">
                <iframe src="${cert.image}#toolbar=0&navpanes=0" class="cert-modal-pdf" title="Sertifikat ${cert.title}"></iframe>
                <div class="cert-pdf-fallback">
                  <div class="cert-pdf-badge-row">
                    <span class="cert-badge-pdf">📄 DOKUMEN PDF RESMI</span>
                  </div>
                  <a href="${cert.image}" target="_blank" rel="noopener noreferrer" class="cert-btn-pdf" title="Buka Dokumen PDF">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    <span>Buka / Unduh PDF di Tab Baru ↗</span>
                  </a>
                </div>
              </div>
            ` : `
              <div class="cert-image-frame">
                <img src="${cert.image}" alt="Sertifikat ${cert.title}" class="cert-modal-img" loading="lazy" />
                <div class="cert-image-actions">
                  <a href="${cert.image}" target="_blank" rel="noopener noreferrer" class="cert-btn-zoom" title="Buka Gambar Penuh">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                    <span>Buka Ukuran Penuh</span>
                  </a>
                </div>
              </div>
            `
          ) : `
            <div class="cert-empty-placeholder">
              <div class="cert-empty-icon">📜</div>
              <p class="cert-empty-title">Pratinjau Dokumen Sertifikat</p>
              <p class="cert-empty-sub">Dokumen digital sertifikat resmi ini terdaftar atas nama <strong>Robby Hidayat</strong>. File sertifikat belum diunggah.</p>
            </div>
          `}
        </div>

        ${cert.description ? `
          <div class="cert-modal-footer">
            <p class="cert-modal-desc">${cert.description}</p>
          </div>
        ` : ''}
      </div>
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
    if (e.target === overlay || e.target.classList.contains('modal-close') || e.target.closest('.cert-modal-close')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.style.display === 'flex') {
      closeModal();
    }
  });
}
