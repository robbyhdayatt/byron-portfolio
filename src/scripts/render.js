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

  grid.innerHTML = list.map((project, idx) => `
    <div class="project-item reveal" data-project-idx="${idx}">
      <div class="project-image-frame" data-project-idx="${idx}" role="button" tabindex="0" aria-label="Buka detail ${project.title}">
        <img src="${project.image}" alt="${project.title}" loading="lazy" />
        <div class="project-image-overlay">
          <span class="view-project-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/></svg>
            Detail Sistem
          </span>
        </div>
      </div>
      <div class="project-info">
        <div class="project-title-row">
          <h3 class="project-title">${project.title}</h3>
          ${project.period ? `<span class="project-period">${project.period}</span>` : ''}
        </div>
        <p class="project-subtitle">${project.subtitle || ''}</p>
        <div class="project-action">
          <button type="button" class="btn-project-detail" data-project-idx="${idx}">
            <span>Lihat Detail</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Initialize Detail Modal & Stacked Card Deck
  initProjectModal(list);
}

function initProjectModal(projectList) {
  const overlay = document.querySelector('.modal-overlay');
  const modalContentWrapper = overlay ? overlay.querySelector('.modal-content') : null;
  if (!overlay || !modalContentWrapper) return;

  const openModal = (idx) => {
    const proj = projectList[idx];
    if (!proj) return;

    const stackArr = proj.stack ? (Array.isArray(proj.stack) ? proj.stack : proj.stack.split(',')) : [];
    const highlights = proj.highlights || [];
    const images = (proj.images && proj.images.length > 0) ? proj.images : (proj.image ? [proj.image] : []);

    modalContentWrapper.className = 'modal-content project-modal-dialog';
    modalContentWrapper.innerHTML = `
      <button class="modal-close-btn" aria-label="Tutup modal">&times;</button>
      <div class="project-modal-grid">
        <!-- 🎴 Left: Interactive Stacked Card Deck -->
        <div class="deck-container">
          <div class="deck-stack" id="deck-stack" title="Klik untuk melihat gambar berikutnya">
            ${images.map((img, i) => `
              <div class="deck-card layer-${i < 3 ? i : 2}" data-card-idx="${i}">
                <img src="${img}" alt="${proj.title} Screenshot ${i + 1}" />
              </div>
            `).join('')}
          </div>
          <div class="deck-footer">
            <div class="deck-hint">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 14h6m-6 0l3-3m-3 3l3 3m16-4h-6m6 0l-3-3m3 3l-3 3"/></svg>
              <span>Klik gambar untuk geser tumpukan</span>
            </div>
            <div class="deck-counter">
              <span id="deck-current">1</span> / ${images.length}
            </div>
          </div>
        </div>

        <!-- 📝 Right: Project Details & Tech Stack -->
        <div class="project-modal-details">
          <h2 class="modal-project-title">${proj.title}</h2>
          <p class="modal-project-subtitle">${proj.subtitle || ''} ${proj.period ? `· ${proj.period}` : ''}</p>

          <div class="modal-label">Teknologi &amp; Tech Stack</div>
          <div class="modal-stack-pills">
            ${stackArr.map(t => `<span class="pill">${getTechIcon(t)}<span>${t.trim()}</span></span>`).join('')}
          </div>

          <div class="modal-label">Deskripsi Sistem &amp; Arsitektur</div>
          <p class="modal-desc">${proj.description || ''}</p>

          ${highlights.length > 0 ? `
            <div class="modal-label">Fitur Unggulan &amp; Spesifikasi</div>
            <ul class="modal-highlights">
              ${highlights.map(h => `<li><span class="check">✓</span> <span>${h}</span></li>`).join('')}
            </ul>
          ` : ''}

          ${proj.impact ? `
            <div class="modal-label">Dampak Bisnis (Business Impact)</div>
            <div class="modal-impact">${proj.impact}</div>
          ` : ''}

          <div class="modal-links-row">
            ${proj.link ? `
              <a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="modal-link-btn btn-primary-link">
                <span>🌐</span> Kunjungi Website ↗
              </a>
            ` : ''}
            ${proj.github ? `
              <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="modal-link-btn btn-secondary-link">
                <span>📂</span> Lihat Source Code (GitHub) ↗
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // GSAP Modal Entrance
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(modalContentWrapper, { scale: 0.92, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.2)' });

    // Close logic
    const closeBtn = modalContentWrapper.querySelector('.modal-close-btn');
    const closeModal = () => {
      gsap.to(modalContentWrapper, { scale: 0.95, opacity: 0, duration: 0.2, ease: 'power2.in' });
      gsap.to(overlay, { opacity: 0, duration: 0.2, onComplete: () => {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      }});
    };
    if (closeBtn) closeBtn.onclick = closeModal;
    overlay.onclick = (e) => {
      if (e.target === overlay) closeModal();
    };

    // 🎴 Wire Interactive Deck Card Click
    setupDeckInteraction(modalContentWrapper, images.length);
  };

  // Open triggers
  document.querySelectorAll('.btn-project-detail, .project-image-frame').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(el.dataset.projectIdx, 10);
      if (!isNaN(idx)) openModal(idx);
    });
  });
}

function setupDeckInteraction(modalWrapper, totalImages) {
  const stack = modalWrapper.querySelector('#deck-stack');
  const counter = modalWrapper.querySelector('#deck-current');
  if (!stack || totalImages <= 1) return;

  let currentIndex = 0;
  let isAnimating = false;

  const updateCardLayers = () => {
    const cards = stack.querySelectorAll('.deck-card');
    cards.forEach((card, idx) => {
      card.classList.remove('layer-0', 'layer-1', 'layer-2');
      if (idx === 0) card.classList.add('layer-0');
      else if (idx === 1) card.classList.add('layer-1');
      else card.classList.add('layer-2');
    });
  };

  stack.addEventListener('click', () => {
    if (isAnimating) return;
    const cards = stack.querySelectorAll('.deck-card');
    if (cards.length < 2) return;

    isAnimating = true;
    const topCard = cards[0];

    // Smooth physics-based card swipe out
    gsap.to(topCard, {
      x: 280,
      rotation: 16,
      opacity: 0,
      scale: 0.88,
      duration: 0.32,
      ease: 'power2.in',
      onComplete: () => {
        // Move to the back of the stack
        stack.appendChild(topCard);
        gsap.set(topCard, { x: 0, rotation: 0, opacity: 0, scale: 0.92 });
        updateCardLayers();
        
        currentIndex = (currentIndex + 1) % totalImages;
        if (counter) counter.textContent = currentIndex + 1;

        // Fade in at the back smoothly
        gsap.to(topCard, { opacity: 0.7, duration: 0.2, onComplete: () => {
          isAnimating = false;
        }});
      }
    });
  });
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
