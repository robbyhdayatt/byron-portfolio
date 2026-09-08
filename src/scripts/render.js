import gsap from 'gsap';
import { projects as fallbackProjects, experiences as fallbackExperiences, organizations as fallbackOrganizations, personal as fallbackPersonal, skills as fallbackSkills } from '../data/content.js';
import { fetchContent } from './github-cms.js';

async function fetchLiveData() {
  return await fetchContent();
}

import { updateTypewriterPhrases } from './typewriter.js';

export async function renderPersonal() {
  const data = await fetchLiveData();
  const personal = (data && data.personal) ? data.personal : fallbackPersonal;
  if (!personal) return;

  // 1. Hero Big Name & Title (Typewriter synchronization)
  if (personal.name) {
    updateTypewriterPhrases(personal.name, personal.title || 'Software Developer');
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

const TECH_ICONS_SVG = {
  'laravel': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#FF2D20"><path d="M23.6 7.1L12.5.7c-.4-.2-.8-.2-1.2 0L.2 7.1c-.3.2-.4.5-.4.8v12.7c0 .3.2.6.4.8l11.1 6.4c.2.1.4.2.6.2.2 0 .4-.1.6-.2l11.1-6.4c.3-.2.4-.5.4-.8V7.9c0-.3-.2-.6-.4-.8zM12 2.3l9.4 5.4-3.6 2.1-9.4-5.4L12 2.3zM1.9 8.6L11 13.9v10.5L1.9 19V8.6zm11.1 15.8V13.9l3.8-2.2v4.8c0 .3.2.6.4.8l3.9 2.2v-4.8l1.3-.8v5.3L13 24.4zm9.1-7.1l-3.9-2.2v-4.8l3.9 2.2v4.8z"/></svg>`,
  'mysql': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#00758F"><path d="M12.1 2.2c-5.4 0-9.8 4.4-9.8 9.8 0 2.8 1.2 5.4 3.1 7.2l-.9 2.6 3.1-1.3c1.4.8 3 1.3 4.5 1.3 5.4 0 9.8-4.4 9.8-9.8 0-5.4-4.4-9.8-9.8-9.8zm0 18c-1.3 0-2.6-.4-3.8-1l-.3-.2-1.9.8.5-1.7-.2-.3c-1.6-1.5-2.5-3.6-2.5-5.8 0-4.5 3.7-8.2 8.2-8.2s8.2 3.7 8.2 8.2-3.7 8.2-8.2 8.2z"/></svg>`,
  'php': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#777BB4"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-3.5 13.5H6.8l1.8-7h2.6c1.4 0 2.3.7 2.1 2-.2 1.6-1.4 2.5-2.8 2.5H9.3l-.8 2.5zm7.7-2.5h-1.6l-.8 2.5h-1.7l1.8-7h2.6c1.4 0 2.3.7 2.1 2-.2 1.6-1.4 2.5-2.4 2.5zM10.1 9h-.9l-.6 2h.9c.7 0 1.2-.4 1.3-1 .1-.6-.2-1-.7-1zm5.2 0h-.9l-.6 2h.9c.7 0 1.2-.4 1.3-1 .1-.6-.2-1-.7-1z"/></svg>`,
  'javascript': `<svg viewBox="0 0 24 24" width="16" height="16"><rect width="24" height="24" rx="4" fill="#F7DF1E"/><path d="M6 17.5l1.6-.9c.4.6.8 1.1 1.5 1.1.8 0 1.2-.3 1.2-1.1v-5.1h2v5.1c0 1.9-1.1 2.8-2.9 2.8-1.5 0-2.6-.8-3.4-1.9zm7.7-1.1l1.6-1c.5.8 1.1 1.3 2 1.3.8 0 1.4-.4 1.4-1 0-.6-.5-.9-1.6-1.4l-.6-.2c-1.6-.7-2.6-1.5-2.6-3.2 0-1.6 1.2-2.8 3.1-2.8 1.4 0 2.4.5 3.2 1.8l-1.5 1c-.4-.7-.9-1-1.7-1-.7 0-1.2.4-1.2.9 0 .6.4.8 1.4 1.3l.6.3c1.9.8 2.9 1.6 2.9 3.4 0 1.9-1.5 3-3.6 3-2 0-3.3-.9-4-2.4z" fill="#000"/></svg>`,
  'typescript': `<svg viewBox="0 0 24 24" width="16" height="16"><rect width="24" height="24" rx="4" fill="#3178C6"/><path d="M4 10.5h6v1.8H7.9V19H5.8v-6.7H4v-1.8zm8.6 4.9l1.6-.9c.4.6.9 1.1 1.6 1.1.7 0 1.1-.3 1.1-.8 0-.5-.4-.7-1.4-1.2l-.5-.2c-1.4-.6-2.3-1.3-2.3-2.7 0-1.4 1.1-2.4 2.7-2.4 1.2 0 2.1.4 2.8 1.5l-1.3.9c-.3-.6-.8-.8-1.5-.8-.6 0-1 .3-1 .7 0 .5.3.7 1.2 1.1l.5.2c1.6.7 2.5 1.4 2.5 2.8 0 1.6-1.3 2.6-3.1 2.6-1.7 0-2.9-.8-3.5-2z" fill="#FFF"/></svg>`,
  'react': `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#61DAFB" stroke-width="1.8"><ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(90 12 12)"/><ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(150 12 12)"/><circle cx="12" cy="12" r="1.8" fill="#61DAFB"/></svg>`,
  'nextjs': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#000"><circle cx="12" cy="12" r="11" fill="#000"/><path d="M14.8 17.5L8.5 9.4h-1.2v7.2h1.4v-5.2l5.7 7.3c.1-.4.3-.8.4-1.2zm.4-8.1h1.4v7.2h-1.4V9.4z" fill="#FFF"/></svg>`,
  'tailwindcss': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#38BDF8"><path d="M12 6c-3.6 0-5.8 1.8-6.6 5.4 1.3-1.8 2.9-2.5 4.8-2 1.1.3 1.9 1.1 2.8 2 1.4 1.5 3 3.2 6.8 3.2 3.6 0 5.8-1.8 6.6-5.4-1.3 1.8-2.9 2.5-4.8 2-1.1-.3-1.9-1.1-2.8-2-1.4-1.5-3-3.2-6.8-3.2zm-6.6 6c-3.6 0-5.8 1.8-6.6 5.4 1.3-1.8 2.9-2.5 4.8-2 1.1.3 1.9 1.1 2.8 2 1.4 1.5 3 3.2 6.8 3.2 3.6 0 5.8-1.8 6.6-5.4-1.3 1.8-2.9 2.5-4.8 2-1.1-.3-1.9-1.1-2.8-2-1.4-1.5-3-3.2-6.8-3.2z"/></svg>`,
  'bootstrap': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#7952B3"><rect width="24" height="24" rx="5" fill="#7952B3"/><path d="M7 6.5h4.6c2.2 0 3.5 1 3.5 2.6 0 1.2-.7 2-1.7 2.3 1.3.3 2.1 1.3 2.1 2.7 0 1.8-1.4 2.9-3.7 2.9H7V6.5zm2.4 4h2c.8 0 1.4-.4 1.4-1.2 0-.7-.5-1.1-1.3-1.1H9.4v2.3zm0 4.5h2.3c.9 0 1.6-.4 1.6-1.3 0-.8-.6-1.3-1.6-1.3H9.4v2.6z" fill="#FFF"/></svg>`,
  'prisma': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#2D3748"><path d="M19.2 18.5L13.7 2.8c-.3-.8-1.3-1-1.8-.4L2.8 14.7c-.5.6-.2 1.6.6 1.8l14.3 3.2c.7.1 1.3-.5 1.5-1.2zM12.4 5.3l4.3 12.3-4.3-1V5.3zm-1.6 1.8v10.5l-6.8-1.5 6.8-9z"/></svg>`,
  'spreadsheet': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#107C41"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/></svg>`,
  'pdf': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#EA4335"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .8-.7 1.5-1.5 1.5H9v2H7.5V7H10c.8 0 1.5.7 1.5 1.5v1zm5 2c0 .8-.7 1.5-1.5 1.5h-2.5V7H15c.8 0 1.5.7 1.5 1.5v3zm3.5-3.5H18v1.5h1.5v1.5H18v2h-1.5V7H20v1.5z"/></svg>`,
  'word': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#2B579A"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3.5 13.5l-1.8-7h-1.4l-1.3 5-1.3-5H8.3l-1.8 7h1.5l1.1-4.7 1.3 4.7h1.4l1.3-4.7 1.1 4.7h1.5z"/></svg>`,
  'api': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#6366F1"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>`,
  'canvas': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#E44D26"><path d="M12 2L2 5v14l10 3 10-3V5L12 2zm0 2.3l7.5 2.2-7.5 2.3-7.5-2.3L12 4.3zM4 8.2l7 2.1v9.5l-7-2.1V8.2zm9 11.6V10.3l7-2.1v9.5l-7 2.1z"/></svg>`,
  'framer': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#0055FF"><path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/></svg>`,
  'adminlte': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#3C8DBC"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="#3C8DBC" stroke-width="2"/><path d="M3 9h18M9 21V9" stroke="#3C8DBC" stroke-width="2"/></svg>`,
  'database': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#4B5563"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5M3 12v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6"/></svg>`,
  'github': `<svg viewBox="0 0 24 24" width="16" height="16" fill="#181717"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`
};

function getTechIcon(tech) {
  const clean = tech.toLowerCase().trim();
  
  if (clean.includes('laravel')) return `<span class="pill-icon">${TECH_ICONS_SVG.laravel}</span>`;
  if (clean.includes('mysql')) return `<span class="pill-icon">${TECH_ICONS_SVG.mysql}</span>`;
  if (clean.includes('php') && !clean.includes('word') && !clean.includes('spreadsheet')) return `<span class="pill-icon">${TECH_ICONS_SVG.php}</span>`;
  if (clean.includes('typescript') || clean === 'ts') return `<span class="pill-icon">${TECH_ICONS_SVG.typescript}</span>`;
  if (clean.includes('javascript') || clean.includes('js') && !clean.includes('next') && !clean.includes('react') && !clean.includes('sheet')) return `<span class="pill-icon">${TECH_ICONS_SVG.javascript}</span>`;
  if (clean.includes('next')) return `<span class="pill-icon">${TECH_ICONS_SVG.nextjs}</span>`;
  if (clean.includes('react')) return `<span class="pill-icon">${TECH_ICONS_SVG.react}</span>`;
  if (clean.includes('tailwind')) return `<span class="pill-icon">${TECH_ICONS_SVG.tailwindcss}</span>`;
  if (clean.includes('bootstrap')) return `<span class="pill-icon">${TECH_ICONS_SVG.bootstrap}</span>`;
  if (clean.includes('prisma')) return `<span class="pill-icon">${TECH_ICONS_SVG.prisma}</span>`;
  if (clean.includes('spreadsheet') || clean.includes('sheet') || clean.includes('xlsx')) return `<span class="pill-icon">${TECH_ICONS_SVG.spreadsheet}</span>`;
  if (clean.includes('pdf') || clean.includes('dompdf')) return `<span class="pill-icon">${TECH_ICONS_SVG.pdf}</span>`;
  if (clean.includes('word') || clean.includes('phpword')) return `<span class="pill-icon">${TECH_ICONS_SVG.word}</span>`;
  if (clean.includes('adminlte')) return `<span class="pill-icon">${TECH_ICONS_SVG.adminlte}</span>`;
  if (clean.includes('dbal') || clean.includes('doctrine')) return `<span class="pill-icon">${TECH_ICONS_SVG.database}</span>`;
  if (clean.includes('broadcast') || clean.includes('api')) return `<span class="pill-icon">${TECH_ICONS_SVG.api}</span>`;
  if (clean.includes('canvas') || clean.includes('html')) return `<span class="pill-icon">${TECH_ICONS_SVG.canvas}</span>`;
  if (clean.includes('framer') || clean.includes('motion')) return `<span class="pill-icon">${TECH_ICONS_SVG.framer}</span>`;
  if (clean.includes('github') || clean.includes('git')) return `<span class="pill-icon">${TECH_ICONS_SVG.github}</span>`;
  
  return `<span class="pill-icon">${TECH_ICONS_SVG.database}</span>`;
}

const DEVICON_MAP = {
  'php': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  'javascript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'typescript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'laravel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
  'react': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'nextjs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'nodejs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'mysql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'postgresql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'html': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'css': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'tailwind': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'bootstrap': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
  'git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'github': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  'figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  'docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'composer': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/composer/composer-original.svg',
  'prisma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg',
};

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
  const track = document.querySelector('#projects-track');
  const dotsContainer = document.querySelector('#projects-pagination-dots');
  if (!track) return;

  const data = await fetchLiveData();
  const list = (data && data.projects) ? data.projects : fallbackProjects;
  if (!list || list.length === 0) return;

  // Render cards
  track.innerHTML = list.map((project, idx) => {
    const images = project.images && project.images.length > 0 ? project.images : (project.image ? [project.image] : []);
    const imgCount = images.length;
    const mainImg = project.image || (images[0] || '');
    const stackArr = project.stack ? (Array.isArray(project.stack) ? project.stack : project.stack.split(',')) : [];
    const topStack = stackArr.slice(0, 2);

    return `
      <div class="project-slide-card" data-project-idx="${idx}">
        <div class="project-slide-preview">
          <img src="${mainImg}" alt="${project.title} Preview" loading="lazy" draggable="false" />
          ${imgCount > 1 ? `
            <div class="project-slide-badge">
              <span>📸 ${imgCount} Slide</span>
            </div>
          ` : ''}
        </div>
        <div class="project-slide-meta">
          <h3 class="project-slide-title" title="${project.title}">${project.title}</h3>
          ${project.subtitle ? `<p class="project-slide-subtitle" title="${project.subtitle}">${project.subtitle}</p>` : ''}
          <div class="project-slide-bottom">
            <div class="project-slide-tags">
              ${topStack.map(t => `<span class="project-mini-tag">${t.trim()}</span>`).join('')}
            </div>
            <button type="button" class="btn-slide-detail" data-project-idx="${idx}">
              <span>Lihat Detail</span>
              <span class="arrow-icon">→</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Render pagination dots
  if (dotsContainer) {
    dotsContainer.innerHTML = list.map((_, i) => `
      <button type="button" class="project-dot ${i === 0 ? 'active' : ''}" data-dot-idx="${i}" aria-label="Lihat proyek ${i + 1}"></button>
    `).join('');
  }

  // Initialize 3D Coverflow Deck Engine
  initCoverflowDeck(list, (idx) => {
    openProjectModal(list, idx);
  });
}

function initCoverflowDeck(list, onCardOpen) {
  const viewport = document.getElementById('projects-carousel-viewport');
  const track = document.getElementById('projects-track');
  const btnPrev = document.getElementById('projects-prev');
  const btnNext = document.getElementById('projects-next');
  const dots = document.querySelectorAll('.project-dot');
  const cards = Array.from(track.querySelectorAll('.project-slide-card'));

  if (!viewport || !track || cards.length === 0) return;

  const total = cards.length;
  let activeIndex = 0;
  let isDragging = false;
  let startX = 0;
  let currentDragOffset = 0;
  let hasMoved = false;

  function updateCoverflow(animated = true) {
    const isMobile = window.innerWidth <= 768;
    const spacing = isMobile ? 190 : 310;

    cards.forEach((card, index) => {
      let distance = index - activeIndex;
      const isActive = index === activeIndex;
      card.classList.toggle('is-active', isActive);

      if (distance === 0) {
        // Active Center Card (Elevated & Magnified)
        const transform = `translate3d(calc(-50% + ${currentDragOffset}px), -50%, 0) scale(1.05) rotateY(0deg) rotateZ(0deg)`;
        card.style.transform = transform;
        card.style.zIndex = '30';
        card.style.opacity = '1';
        card.style.filter = 'none';
        card.style.pointerEvents = 'auto';
      } else {
        const absDist = Math.abs(distance);
        const sign = distance > 0 ? 1 : -1;
        
        // 3D Perspective placement
        const offsetX = (sign * spacing * Math.min(absDist, 3.5)) + currentDragOffset;
        const scale = Math.max(0.72, 1 - (absDist * 0.12));
        const rotateY = sign * -16;
        const rotateZ = sign * 1.5;
        const opacity = Math.max(0.12, 0.72 - (absDist - 1) * 0.28);
        const zIndex = 25 - absDist;

        card.style.transform = `translate3d(calc(-50% + ${offsetX}px), -50%, ${-absDist * 40}px) scale(${scale}) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
        card.style.zIndex = `${zIndex}`;
        card.style.opacity = `${opacity}`;
        card.style.filter = 'brightness(0.88)';
        card.style.pointerEvents = absDist > 2 ? 'none' : 'auto';
      }

      if (!animated) {
        card.style.transition = 'none';
      } else {
        card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease, filter 0.45s ease, box-shadow 0.3s ease';
      }
    });

    // Update pagination dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }

  function goToIndex(newIndex) {
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= total) newIndex = total - 1;
    activeIndex = newIndex;
    currentDragOffset = 0;
    updateCoverflow(true);
  }

  // Initial render
  updateCoverflow(false);

  // Resize handler
  window.addEventListener('resize', () => {
    updateCoverflow(false);
  });

  // Nav buttons
  if (btnPrev) {
    btnPrev.onclick = (e) => {
      e.preventDefault();
      if (activeIndex > 0) {
        goToIndex(activeIndex - 1);
      } else {
        goToIndex(total - 1);
      }
    };
  }

  if (btnNext) {
    btnNext.onclick = (e) => {
      e.preventDefault();
      if (activeIndex < total - 1) {
        goToIndex(activeIndex + 1);
      } else {
        goToIndex(0);
      }
    };
  }

  // Dots click
  dots.forEach(dot => {
    dot.onclick = () => {
      const idx = parseInt(dot.dataset.dotIdx, 10);
      goToIndex(idx);
    };
  });

  // Pointer Drag & Swipe Interaction
  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    isDragging = true;
    hasMoved = false;
    startX = e.clientX;
    currentDragOffset = 0;
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 6) {
      hasMoved = true;
    }
    currentDragOffset = dx * 0.75;
    updateCoverflow(false);
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;

    if (hasMoved) {
      const threshold = 60;
      if (currentDragOffset < -threshold) {
        goToIndex((activeIndex + 1) % total);
      } else if (currentDragOffset > threshold) {
        goToIndex((activeIndex - 1 + total) % total);
      } else {
        currentDragOffset = 0;
        updateCoverflow(true);
      }
    } else {
      currentDragOffset = 0;
      updateCoverflow(true);
    }
  }

  viewport.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  // Keyboard navigation (when modal is closed)
  window.addEventListener('keydown', (e) => {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay && overlay.style.display === 'flex') return;

    if (e.key === 'ArrowLeft') {
      goToIndex((activeIndex - 1 + total) % total);
    } else if (e.key === 'ArrowRight') {
      goToIndex((activeIndex + 1) % total);
    }
  });

  // Card click handlers
  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      if (hasMoved) return;
      e.stopPropagation();

      if (index === activeIndex) {
        if (onCardOpen) onCardOpen(index);
      } else {
        goToIndex(index);
      }
    });

    const btnDetail = card.querySelector('.btn-slide-detail');
    if (btnDetail) {
      btnDetail.addEventListener('click', (e) => {
        e.stopPropagation();
        if (index === activeIndex) {
          if (onCardOpen) onCardOpen(index);
        } else {
          goToIndex(index);
        }
      });
    }
  });
}

function openProjectModal(projectList, idx) {
  const overlay = document.querySelector('.modal-overlay');
  const modalContentWrapper = overlay ? overlay.querySelector('.modal-content') : null;
  if (!overlay || !modalContentWrapper) return;

  const proj = projectList[idx];
  if (!proj) return;

  const images = proj.images && proj.images.length > 0 ? proj.images : (proj.image ? [proj.image] : []);
  const stackArr = proj.stack ? (Array.isArray(proj.stack) ? proj.stack : proj.stack.split(',')) : [];
  const highlights = proj.highlights || [];

  modalContentWrapper.innerHTML = `
    <div class="project-modal-dialog">
      <button class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">&times;</button>
      
      <div class="project-modal-grid">
        <!-- Left: Interactive Card Stack Deck Gallery (Tumpukan Fisik Bergaya Kartu) -->
        <div class="modal-gallery-deck">
          <div class="deck-hint-bar">
            <span>📸 Tumpukan Pratinjau Sistem</span>
            <span class="deck-counter-badge" id="deck-counter">1 / ${images.length}</span>
          </div>
          
          <div class="deck-stack-area" id="deck-stack-area" title="Klik kartu untuk melihat gambar berikutnya">
            ${images.map((img, i) => `
              <div class="deck-card" data-card-idx="${i}">
                <img src="${img}" alt="${proj.title} - Slide ${i+1}" />
              </div>
            `).join('')}
            ${images.length > 1 ? `
              <div class="deck-tap-indicator">
                <span>👆 Klik kartu untuk ganti</span>
              </div>
            ` : ''}
          </div>
        </div>
        
        <!-- Right: Details & Specs Column -->
        <div class="modal-info-column">
          <div class="modal-header-block">
            <h2 class="modal-project-title">${proj.title}</h2>
            ${proj.subtitle ? `<p class="modal-project-subtitle">${proj.subtitle}</p>` : ''}
          </div>
          
          <div class="modal-tech-stack">
            ${stackArr.map(t => `<span class="modal-stack-pill">${getTechIcon(t)}<span>${t.trim()}</span></span>`).join('')}
          </div>
          
          <div class="modal-body-content">
            <h4 class="modal-section-heading">Deskripsi &amp; Arsitektur Sistem</h4>
            <p class="modal-description-text">${proj.description || ''}</p>
            
            ${highlights.length > 0 ? `
              <h4 class="modal-section-heading">Fitur &amp; Spesifikasi Utama</h4>
              <ul class="modal-highlights-list">
                ${highlights.map(h => `<li><span class="check-icon">✓</span> <span>${h}</span></li>`).join('')}
              </ul>
            ` : ''}
            
            ${proj.impact ? `
              <div class="modal-impact-callout">
                <span class="impact-icon">💡</span>
                <div class="impact-text">
                  <strong>Dampak Bisnis:</strong> ${proj.impact}
                </div>
              </div>
            ` : ''}
          </div>
          
          <div class="modal-footer-actions">
            ${proj.github ? `
              <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="modal-btn modal-btn-github">
                <span>📂</span> Lihat Source Code (GitHub) ↗
              </a>
            ` : ''}
            ${proj.link ? `
              <a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="modal-btn modal-btn-primary">
                <span>🌐</span> Kunjungi Website ↗
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;

  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Initialize Physical Card Stack Animation
  const deckArea = modalContentWrapper.querySelector('#deck-stack-area');
  initDeckAnimation(deckArea, images);

  // Close handlers
  function closeModal() {
    window.removeEventListener('keydown', onKeyDown);
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

  function onKeyDown(e) {
    if (e.key === 'Escape') closeModal();
  }

  window.addEventListener('keydown', onKeyDown);

  const closeBtn = modalContentWrapper.querySelector('#modal-close-btn');
  if (closeBtn) closeBtn.onclick = closeModal;
  overlay.onclick = (event) => {
    if (event.target === overlay) closeModal();
  };

  // Entrance animation
  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25 });
  gsap.fromTo(modalContentWrapper, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.2)' });
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
        // Deeper cards
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
        }, 220);
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
            <h4>${item.organization || item.name || ''}</h4>
            <span class="period">${item.period}</span>
            <p>${item.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  timeline.innerHTML = html;
}
