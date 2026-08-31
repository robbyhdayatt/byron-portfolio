import gsap from 'gsap';
import { projects as fallbackProjects, experiences as fallbackExperiences, organizations as fallbackOrganizations, personal as fallbackPersonal, skills as fallbackSkills } from '../data/content.js';
import { fetchContent } from './github-cms.js';

async function fetchLiveData() {
  return await fetchContent();
}

export async function renderPersonal() {
  const data = await fetchLiveData();
  const personal = (data && data.personal) ? data.personal : fallbackPersonal;
  if (!personal) return;

  // 1. Hero Big Name (Split by first word or space)
  const heroNameEl = document.querySelector('.hero-big-name');
  if (heroNameEl && personal.name) {
    const parts = personal.name.trim().split(/\s+/);
    if (parts.length > 1) {
      heroNameEl.innerHTML = `${parts[0]}<br>${parts.slice(1).join(' ')}`;
    } else {
      heroNameEl.textContent = personal.name;
    }
  }

  // 2. Hero Tagline
  const heroTaglineEl = document.querySelector('.hero-tagline');
  if (heroTaglineEl && personal.tagline) {
    heroTaglineEl.textContent = personal.tagline;
  }

  // 3. Hero Badge Developer Name & Role
  document.querySelectorAll('.badge-name-val, .ide-name-val').forEach(el => {
    if (personal.name) el.textContent = personal.name.toUpperCase();
  });
  document.querySelectorAll('.badge-role-val, .ide-role-val').forEach(el => {
    if (personal.title) el.textContent = personal.title;
  });

  // 4. Contact Email
  const emailTextEl = document.querySelector('#email-text');
  if (emailTextEl && personal.email) {
    emailTextEl.textContent = personal.email;
  }
  const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
  mailtoLinks.forEach(link => {
    if (personal.email) link.href = `mailto:${personal.email}`;
  });

  // 5. Social Links
  if (personal.linkedin) {
    document.querySelectorAll('a[href*="linkedin.com"]').forEach(link => link.href = personal.linkedin);
  }
  if (personal.github) {
    document.querySelectorAll('a[href*="github.com"]').forEach(link => link.href = personal.github);
  }
  if (personal.instagram) {
    document.querySelectorAll('a[href*="instagram.com"]').forEach(link => link.href = personal.instagram);
  }

  // 6. Footer Name & Copyright
  const footerNameEl = document.querySelector('.footer-name');
  if (footerNameEl && personal.name) {
    footerNameEl.textContent = personal.name;
  }
  const copyrightEl = document.querySelector('.copyright');
  if (copyrightEl && personal.name) {
    copyrightEl.textContent = `© 2026 ${personal.name}. All rights reserved.`;
  }

  // 7. Dynamic Document Title & Meta Tags
  if (personal.name) {
    const titleText = personal.title ? `${personal.name} — ${personal.title}` : personal.name;
    document.title = titleText;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', titleText);
  }
}

const DEVICON_MAP = {
  'php': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  'javascript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'typescript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'ts': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'laravel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
  'react': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'reactjs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'vue': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'nextjs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'nodejs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'mysql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'postgresql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'html': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'html5': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'css': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'css3': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'tailwind': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'tailwindcss': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'bootstrap': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
  'git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'github': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  'figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  'docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'composer': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/composer/composer-original.svg',
  'prisma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg',
};

function getTechIcon(tech) {
  const clean = tech.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [mapKey, url] of Object.entries(DEVICON_MAP)) {
    const cleanMap = mapKey.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.includes(cleanMap) || cleanMap.includes(clean)) {
      return `<img src="${url}" alt="${tech}" class="pill-icon" loading="lazy" />`;
    }
  }
  return '';
}

export async function renderSkills() {
  const data = await fetchLiveData();
  const skillData = (data && data.skills) ? data.skills : fallbackSkills;
  if (!skillData) return;

  // 1. Render Technical Skills Marquee
  const allTech = [...(skillData.languages || []), ...(skillData.frameworks || [])];
  const trackEl = document.querySelector('.marquee-track');
  
  if (trackEl && allTech.length > 0) {
    const groupHtml = allTech.map(tech => {
      const key = tech.toLowerCase().trim();
      const iconUrl = DEVICON_MAP[key] || `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${key}/${key}-original.svg`;
      return `
        <div class="logo-card" title="${tech}">
          <img src="${iconUrl}" alt="${tech}" onerror="this.style.display='none'" loading="lazy" />
          <span>${tech}</span>
        </div>
      `;
    }).join('');

    trackEl.innerHTML = `
      <div class="marquee-group">${groupHtml}</div>
      <div class="marquee-group" aria-hidden="true">${groupHtml}</div>
      <div class="marquee-group" aria-hidden="true">${groupHtml}</div>
    `;
  }

  // 2. Render Soft Skills Chips
  const softRow = document.querySelector('.soft-skills-row');
  if (softRow && skillData.softSkills && skillData.softSkills.length > 0) {
    softRow.innerHTML = skillData.softSkills.map(skill => `<span class="soft-skill-chip">${skill}</span>`).join('');
  }
}

export async function renderProjects() {
  const grid = document.querySelector('#projects-grid');
  if (!grid) return;

  const data = await fetchLiveData();
  const list = (data && data.projects) ? data.projects : fallbackProjects;
  if (!list || list.length === 0) return;

  grid.innerHTML = list.map((project, idx) => {
    const images = project.images && project.images.length > 0 ? project.images : (project.image ? [project.image] : []);
    const imgCount = images.length;
    const mainImg = project.image || (images[0] || '');

    return `
      <div class="project-clean-item reveal" data-project-idx="${idx}">
        <div class="project-clean-preview">
          <img src="${mainImg}" alt="${project.title} Preview" loading="lazy" />
          ${imgCount > 1 ? `
            <div class="project-preview-overlay">
              <span>📸 ${imgCount} Gambar</span>
            </div>
          ` : ''}
        </div>
        <div class="project-clean-meta">
          <h3 class="project-clean-title">
            <span>${project.title}</span>
          </h3>
          ${project.subtitle ? `<p class="project-clean-subtitle">${project.subtitle}</p>` : ''}
          <button type="button" class="btn-clean-detail" data-project-idx="${idx}">
            <span>Lihat Detail</span>
            <span class="arrow-icon">→</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Initialize Detail Modal & Interactive Card Stacks
  initProjectModal(list);
}

function initProjectModal(projectList) {
  const overlay = document.querySelector('.modal-overlay');
  const modalContentWrapper = overlay ? overlay.querySelector('.modal-content') : null;
  if (!overlay || !modalContentWrapper) return;

  // Handle click on card or button
  const triggerElements = document.querySelectorAll('.project-clean-item, .btn-clean-detail');
  triggerElements.forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const idxAttr = el.dataset.projectIdx;
      if (idxAttr === undefined) return;
      const idx = parseInt(idxAttr, 10);
      const proj = projectList[idx];
      if (!proj) return;

      const images = proj.images && proj.images.length > 0 ? proj.images : (proj.image ? [proj.image] : []);
      const stackArr = proj.stack ? (Array.isArray(proj.stack) ? proj.stack : proj.stack.split(',')) : [];
      const highlights = proj.highlights || [];

      modalContentWrapper.innerHTML = `
        <div class="project-modal-dialog">
          <button class="modal-close-btn" aria-label="Close modal">&times;</button>
          
          <!-- Left: Interactive Image Stack Gallery -->
          <div class="modal-gallery-deck">
            <div class="deck-hint-bar">
              <span>📸 Galeri Pratinjau Sistem</span>
              <span class="deck-counter-badge" id="deck-counter">1 / ${images.length}</span>
            </div>
            
            <div class="deck-stack-area" id="deck-stack-area" title="Klik gambar untuk beralih ke gambar berikutnya">
              ${images.map((img, i) => `
                <div class="deck-card" data-card-idx="${i}">
                  <img src="${img}" alt="${proj.title} - Slide ${i+1}" />
                </div>
              `).join('')}
              ${images.length > 1 ? `
                <div class="deck-tap-indicator">
                  <span>👆 Klik gambar untuk ganti</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Right: Project Details & Tech Stack -->
          <div class="modal-info-panel">
            <h2>${proj.title}</h2>
            ${proj.subtitle ? `<p class="modal-sub">${proj.subtitle}</p>` : ''}
            
            <div class="modal-stack-pills">
              ${stackArr.map(t => `<span class="pill">${getTechIcon(t)}<span>${t.trim()}</span></span>`).join('')}
            </div>
            
            <div class="modal-section-label">Tentang Sistem &amp; Arsitektur</div>
            <p>${proj.description || ''}</p>
            
            ${highlights.length > 0 ? `
              <div class="modal-section-label">Fitur &amp; Spesifikasi Utama</div>
              <ul class="modal-highlights-list">
                ${highlights.map(h => `<li><span class="check-icon">✓</span> <span>${h}</span></li>`).join('')}
              </ul>
            ` : ''}
            
            ${proj.impact ? `
              <div class="modal-impact-box">
                <p>💡 <strong>Dampak Bisnis:</strong> ${proj.impact}</p>
              </div>
            ` : ''}
            
            <div class="modal-action-buttons">
              ${proj.github ? `
                <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="btn-action btn-github">
                  <span>📂</span> GitHub Repository ↗
                </a>
              ` : ''}
              ${proj.link ? `
                <a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="btn-action btn-web">
                  <span>🌐</span> Kunjungi Website ↗
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      // Setup close button and outside click
      const closeBtn = modalContentWrapper.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.onclick = closeModal;
      }
      overlay.onclick = (event) => {
        if (event.target === overlay) closeModal();
      };

      function closeModal() {
        gsap.to(modalContentWrapper, {
          scale: 0.95,
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
          }
        });
      }

      // Entrance animation
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(modalContentWrapper, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.2)' });

      // Initialize Interactive Image Stack Deck Physics
      const deckArea = modalContentWrapper.querySelector('#deck-stack-area');
      initDeckAnimation(deckArea, images);
    });
  });
}

function initDeckAnimation(deckArea, images) {
  if (!deckArea || images.length <= 1) return;

  let activeIndex = 0;
  const cards = Array.from(deckArea.querySelectorAll('.deck-card'));
  const counterEl = document.getElementById('deck-counter');
  let isAnimating = false;

  function updateStackLayout(animate = true) {
    const total = cards.length;
    cards.forEach((card, index) => {
      const offset = (index - activeIndex + total) % total;

      let zIndex, rotate, translateY, scale, opacity;

      if (offset === 0) {
        // Active Top Card
        zIndex = 10;
        rotate = 0;
        translateY = 0;
        scale = 1;
        opacity = 1;
      } else if (offset === 1) {
        // Second card (peeking with slight right tilt)
        zIndex = 9;
        rotate = 3.5;
        translateY = 12;
        scale = 0.95;
        opacity = 0.88;
      } else if (offset === 2) {
        // Third card (peeking with slight left tilt)
        zIndex = 8;
        rotate = -3;
        translateY = 22;
        scale = 0.90;
        opacity = 0.70;
      } else {
        // Any deeper cards
        zIndex = 5;
        rotate = 0;
        translateY = 28;
        scale = 0.85;
        opacity = 0;
      }

      if (animate) {
        gsap.to(card, {
          zIndex,
          rotation: rotate,
          y: translateY,
          scale: scale,
          opacity: opacity,
          duration: 0.4,
          ease: 'power2.out'
        });
      } else {
        gsap.set(card, {
          zIndex,
          rotation: rotate,
          y: translateY,
          scale: scale,
          opacity: opacity,
          x: 0
        });
      }
    });

    if (counterEl) {
      counterEl.textContent = `${activeIndex + 1} / ${total}`;
    }
  }

  // Initial layout set
  updateStackLayout(false);

  // Click on image stack to swipe top card away & show next
  deckArea.onclick = (e) => {
    e.stopPropagation();
    if (isAnimating) return;
    isAnimating = true;

    const currentTopCard = cards[activeIndex];

    // Animate top card flying off to the right with physics
    gsap.to(currentTopCard, {
      x: 280,
      rotation: 16,
      opacity: 0,
      duration: 0.32,
      ease: 'power2.in',
      onComplete: () => {
        // Advance active index
        activeIndex = (activeIndex + 1) % cards.length;
        // Reset old top card coordinates behind
        gsap.set(currentTopCard, { x: 0 });
        // Update all cards in stack
        updateStackLayout(true);
        setTimeout(() => {
          isAnimating = false;
        }, 250);
      }
    });
  };
}

export async function renderTimeline() {
  const timeline = document.querySelector('#timeline');
  if (!timeline) return;

  const data = await fetchLiveData();
  const expList = (data && data.experiences) ? data.experiences : fallbackExperiences;
  const orgList = (data && data.organizations) ? data.organizations : fallbackOrganizations;

  let html = `
    <div class="timeline-container">
      <!-- Left Column: Experience -->
      <div class="timeline-col timeline-col-left">
        <h3 class="timeline-col-title" data-i18n="exp_col_title">Pengalaman Kerja</h3>
        ${(expList || []).map(item => `
          <div class="timeline-item reveal">
            <span class="badge">Experience</span>
            <h3>${item.role}</h3>
            <h4>${item.company}</h4>
            <span class="period">${item.period}</span>
            <p>${item.description}</p>
          </div>
        `).join('')}
      </div>

      <!-- Right Column: Organization -->
      <div class="timeline-col timeline-col-right">
        <h3 class="timeline-col-title" data-i18n="org_col_title">Pengalaman Organisasi</h3>
        ${(orgList || []).map(item => `
          <div class="timeline-item reveal">
            <span class="badge badge-org">Organization</span>
            <h3>${item.role}</h3>
            <h4>${item.organization}</h4>
            <span class="period">${item.period}</span>
            <p>${item.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  timeline.innerHTML = html;
}
