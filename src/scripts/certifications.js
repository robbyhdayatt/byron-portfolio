import gsap from 'gsap';
import { certifications as fallbackCerts } from '../data/content.js';
import { fetchContent } from './github-cms.js';

function isPdf(url) {
  if (!url) return false;
  return url.toLowerCase().split('?')[0].endsWith('.pdf') || url.includes('.pdf');
}

let _pdfJsPromise = null;

function loadPdfJs() {
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    return Promise.resolve(window.pdfjsLib);
  }
  if (_pdfJsPromise) return _pdfJsPromise;

  _pdfJsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      } else {
        reject(new Error('PDF.js not loaded'));
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return _pdfJsPromise;
}

async function renderPdfToCanvas(url, canvasEl, loaderEl) {
  try {
    const pdfjs = await loadPdfJs();
    const loadingTask = pdfjs.getDocument({
      url,
      cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
      cMapPacked: true,
    });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const parent = canvasEl.parentElement;
    const containerWidth = Math.min((parent ? parent.clientWidth : 800) || 800, 860);
    const unscaledViewport = page.getViewport({ scale: 1 });
    const pixelRatio = Math.max(window.devicePixelRatio || 1.5, 1.5);
    const scale = (containerWidth / unscaledViewport.width) * pixelRatio;
    const viewport = page.getViewport({ scale });

    canvasEl.width = viewport.width;
    canvasEl.height = viewport.height;
    canvasEl.style.width = '100%';
    canvasEl.style.height = 'auto';

    const ctx = canvasEl.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;

    if (loaderEl) loaderEl.style.display = 'none';
    canvasEl.style.display = 'block';
  } catch (err) {
    console.error('Failed to render PDF to canvas:', err);
    if (loaderEl) {
      loaderEl.innerHTML = `
        <div class="cert-empty-icon">📜</div>
        <p class="cert-empty-title">Pratinjau Dokumen Sertifikat</p>
        <p class="cert-empty-sub">Dokumen digital sertifikat resmi terdaftar atas nama <strong>Robby Hidayat</strong>.</p>
      `;
    }
  }
}

export async function init(prefersReducedMotion) {
  const grid = document.querySelector('#certs-grid');
  const overlay = document.querySelector('.modal-overlay');
  
  if (!grid) return;

  // Pre-initialize PDF.js worker in background
  loadPdfJs().catch(() => {});

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
            ${isDocumentPdf ? '<span class="cert-badge-pdf-tag">📄 Dokumen Resmi</span>' : ''}
          </div>
          <h2 class="cert-modal-title">${cert.title || ''}</h2>
        </div>

        <div class="cert-modal-media">
          ${cert.image ? (
            isDocumentPdf ? `
              <div class="cert-pdf-canvas-container">
                <div class="cert-pdf-loader" id="cert-pdf-loader">
                  <div class="cert-spinner"></div>
                  <span>Memuat lembar sertifikat...</span>
                </div>
                <canvas id="cert-pdf-canvas" class="cert-modal-canvas" style="display: none;"></canvas>
              </div>
            ` : `
              <div class="cert-image-frame">
                <img src="${cert.image}" alt="Sertifikat ${cert.title}" class="cert-modal-img" loading="lazy" />
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

    if (isDocumentPdf && cert.image) {
      const canvasEl = modalContentWrapper.querySelector('#cert-pdf-canvas');
      const loaderEl = modalContentWrapper.querySelector('#cert-pdf-loader');
      if (canvasEl) {
        renderPdfToCanvas(cert.image, canvasEl, loaderEl);
      }
    }

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
