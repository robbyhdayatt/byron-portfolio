import { projects as fallbackProjects, experiences as fallbackExperiences, organizations as fallbackOrganizations } from '../data/content.js';

let liveData = null;

async function fetchLiveData() {
  if (liveData) return liveData;
  try {
    const res = await fetch('./admin/content.json?v=' + Date.now());
    if (res.ok) {
      liveData = await res.json();
    }
  } catch (e) {
    console.log('Using static content fallback');
  }
  return liveData;
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
        <h3 class="timeline-col-title" data-i18n="exp_title">Pengalaman Kerja</h3>
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
        <h3 class="timeline-col-title" data-i18n="org_title">Pengalaman Organisasi</h3>
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
