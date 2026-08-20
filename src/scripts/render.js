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

  // 3. Boarding Pass Passenger Name
  const bpPassengerEl = document.querySelector('.bp-passenger-val');
  if (bpPassengerEl && personal.name) {
    bpPassengerEl.textContent = personal.name.toUpperCase();
  }

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
  'react.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'vue': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'vuejs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'nextjs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'nodejs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'mysql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'postgresql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'postgres': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'mongodb': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'html': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'html5': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'css': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'css3': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'tailwind': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'tailwindcss': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'bootstrap': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
  'git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'github': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  'git/github': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  'docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'composer': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/composer/composer-original.svg',
  'rest api': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  'api': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  'livewire': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
  'wordpress': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg',
  'flutter': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
  'dart': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg',
  'c++': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'c': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
  'java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'sass': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
  'linux': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
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

  grid.innerHTML = list.map(project => `
    <div class="project-card reveal">
      ${project.image ? `
        <div class="project-image-window">
          <div class="window-bar">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
            <span class="window-url">${project.title ? project.title.toLowerCase().replace(/\s+/g, '') : 'app'}.app</span>
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
          ${project.stack ? (Array.isArray(project.stack) ? project.stack : project.stack.split(',')).map(tech => `<span class="pill">${tech.trim()}</span>`).join('') : ''}
        </div>
        <p>${project.description || ''}</p>
        ${project.impact ? `<p class="impact">${project.impact}</p>` : ''}
      </div>
    </div>
  `).join('');
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
