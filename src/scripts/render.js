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
    const isFeatured = !!project.featured;
    const category = project.category || 'enterprise';
    const statusBadge = project.statusBadge || (isFeatured ? 'Production Active' : '');
    const stackArr = project.stack ? (Array.isArray(project.stack) ? project.stack : project.stack.split(',')) : [];
    const highlights = project.highlights || [];
    const domainUrl = project.title ? project.title.toLowerCase().replace(/[^a-z0-9]/g, '') + '.app' : 'app.system';

    if (isFeatured) {
      return `
        <div class="project-card featured-project-card reveal" data-category="${category}" data-index="${idx}">
          <div class="featured-badge-top">
            <span>⭐</span>
            <span>FEATURED FLAGSHIP ENTERPRISE PROJECT</span>
          </div>
          <div class="featured-card-layout">
            <div class="project-image-window featured-image-window">
              <div class="window-bar">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
                <span class="window-url">${domainUrl}</span>
                ${statusBadge ? `<span class="project-status-chip"><span class="pulse-dot"></span> ${statusBadge}</span>` : ''}
              </div>
              <div class="window-body">
                <img src="${project.image}" alt="${project.title} Preview" loading="lazy" />
              </div>
            </div>
            <div class="project-content featured-content">
              <div class="featured-header">
                <h3>${project.title}</h3>
                ${project.subtitle ? `<h4>${project.subtitle}</h4>` : ''}
              </div>
              <div class="stack-pills">
                ${stackArr.map(tech => `<span class="pill">${getTechIcon(tech)}<span>${tech.trim()}</span></span>`).join('')}
              </div>
              ${highlights.length > 0 ? `
                <ul class="project-highlights">
                  ${highlights.map(h => `<li><span class="check-icon">✓</span> <span>${h}</span></li>`).join('')}
                </ul>
              ` : ''}
              <p>${project.description || ''}</p>
              ${project.impact ? `<p class="impact">${project.impact}</p>` : ''}
              <div class="project-links">
                ${project.link ? `
                  <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link-btn btn-demo">
                    <span>🌐</span> Live Site ↗
                  </a>
                ` : ''}
                ${project.github ? `
                  <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link-btn btn-github">
                    <span>📂</span> GitHub Repo ↗
                  </a>
                ` : ''}
                <button type="button" class="project-link-btn btn-spec" data-project-idx="${idx}">
                  <span>🔍</span> Detail Arsitektur
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="project-card regular-project-card reveal" data-category="${category}" data-index="${idx}">
        ${project.image ? `
          <div class="project-image-window">
            <div class="window-bar">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
              <span class="window-url">${domainUrl}</span>
              ${statusBadge ? `<span class="project-status-chip"><span class="pulse-dot"></span> ${statusBadge}</span>` : ''}
            </div>
            <div class="window-body">
              <img src="${project.image}" alt="${project.title} Preview" loading="lazy" />
            </div>
          </div>
        ` : ''}
        <div class="project-content">
          <h3>${project.title}</h3>
          ${project.subtitle ? `<h4>${project.subtitle}</h4>` : ''}
          <div class="stack-pills">
            ${stackArr.map(tech => `<span class="pill">${getTechIcon(tech)}<span>${tech.trim()}</span></span>`).join('')}
          </div>
          ${highlights.length > 0 ? `
            <ul class="project-highlights">
              ${highlights.slice(0, 2).map(h => `<li><span class="check-icon">✓</span> <span>${h}</span></li>`).join('')}
            </ul>
          ` : ''}
          <p>${project.description || ''}</p>
          ${project.impact ? `<p class="impact">${project.impact}</p>` : ''}
          <div class="project-links">
            ${project.link ? `
              <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link-btn btn-demo">
                <span>🌐</span> Live Demo ↗
              </a>
            ` : ''}
            ${project.github ? `
              <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link-btn btn-github">
                <span>📂</span> GitHub ↗
              </a>
            ` : ''}
            <button type="button" class="project-link-btn btn-spec" data-project-idx="${idx}">
              <span>🔍</span> Detail
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // 1. Initialize Category Filter Tabs
  initProjectFilters();

  // 2. Initialize Detail Modal
  initProjectModal(list);
}

function initProjectFilters() {
  const tabs = document.querySelectorAll('.filter-tab-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      cards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initProjectModal(projectList) {
  const overlay = document.querySelector('.modal-overlay');
  const modalContentWrapper = overlay ? overlay.querySelector('.modal-content') : null;
  if (!overlay || !modalContentWrapper) return;

  document.querySelectorAll('.btn-spec').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.projectIdx, 10);
      const proj = projectList[idx];
      if (!proj) return;

      const stackArr = proj.stack ? (Array.isArray(proj.stack) ? proj.stack : proj.stack.split(',')) : [];
      const highlights = proj.highlights || [];

      modalContentWrapper.innerHTML = `
        <button class="modal-close" aria-label="Close modal">&times;</button>
        <div class="project-modal-header">
          ${proj.statusBadge ? `<span class="project-status-chip"><span class="pulse-dot"></span> ${proj.statusBadge}</span>` : ''}
          <h2>${proj.title}</h2>
          ${proj.subtitle ? `<p class="project-modal-sub">${proj.subtitle}</p>` : ''}
        </div>
        ${proj.image ? `
          <div class="project-modal-preview">
            <img src="${proj.image}" alt="${proj.title}" />
          </div>
        ` : ''}
        <div class="project-modal-body">
          <div class="modal-stack-pills">
            ${stackArr.map(t => `<span class="pill">${getTechIcon(t)}<span>${t.trim()}</span></span>`).join('')}
          </div>
          <div class="modal-section-title">Deskripsi Sistem &amp; Arsitektur</div>
          <p style="color: var(--ink-navy); line-height: 1.7; font-size: 0.9rem;">${proj.description}</p>
          ${highlights.length > 0 ? `
            <div class="modal-section-title">Fitur Unggulan &amp; Spesifikasi</div>
            <ul class="project-highlights">
              ${highlights.map(h => `<li><span class="check-icon">✓</span> <span>${h}</span></li>`).join('')}
            </ul>
          ` : ''}
          ${proj.impact ? `
            <div class="modal-section-title">Dampak Bisnis (Business Impact)</div>
            <p class="impact" style="color: #B45309; font-weight: 600; font-size: 0.9rem;">${proj.impact}</p>
          ` : ''}
          <div class="project-links modal-actions">
            ${proj.link ? `<a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="project-link-btn btn-demo"><span>🌐</span> Kunjungi Website ↗</a>` : ''}
            ${proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="project-link-btn btn-github"><span>📂</span> Lihat Source Code (GitHub) ↗</a>` : ''}
          </div>
        </div>
      `;

      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      const closeBtn = modalContentWrapper.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.onclick = () => {
          overlay.style.display = 'none';
          document.body.style.overflow = '';
        };
      }

      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(modalContentWrapper, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.4)' });
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
