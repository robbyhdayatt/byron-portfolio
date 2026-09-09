/**
 * admin.js — Byron Studio CMS 2.0
 * Full-featured interactive portfolio content management studio.
 * Supports GitHub Direct Commit API, Direct File Uploading for Cover & Card Stack Gallery,
 * Drag/Reorder sorting, Live Search, and Raw JSON Backup & Export.
 */

import { fetchContent, saveContent, uploadImage, verifyToken } from '../scripts/github-cms.js';

// ─────────────────────────────────────────────────────────────
// STATE & CONSTANTS
// ─────────────────────────────────────────────────────────────

let state = null; // Full content.json in memory
const SESSION_KEY_TOKEN = 'byron_gh_token';
const LOCAL_STORAGE_DRAFT = 'byron_cms_draft_v2';

let expandedProjectId = 0; // Default expand first project for better UX
let projectSearchQuery = '';

const getToken = () => sessionStorage.getItem(SESSION_KEY_TOKEN);

// Quick suggestions for tech stack
const COMMON_TECH_SUGGESTIONS = [
  'Laravel', 'MySQL', 'PHP', 'JavaScript', 'TypeScript', 'React',
  'Next.js', 'Tailwind CSS', 'Bootstrap', 'Prisma', 'PhpSpreadsheet',
  'DomPDF', 'PHPWord', 'AdminLTE', 'BroadcastChannel API', 'HTML5 Canvas',
  'Framer Motion', 'Git', 'Figma', 'Docker'
];

// ─────────────────────────────────────────────────────────────
// DOM REFS
// ─────────────────────────────────────────────────────────────

const loginScreen  = document.getElementById('login-screen');
const adminApp     = document.getElementById('admin-app');
const loginForm    = document.getElementById('login-form');
const loginAlert   = document.getElementById('login-alert');
const toast        = document.getElementById('toast');
const syncBadge    = document.getElementById('sync-badge');
let toastTimeout   = null;

// ─────────────────────────────────────────────────────────────
// TOAST NOTIFICATIONS
// ─────────────────────────────────────────────────────────────

function showToast(msg, isSuccess = true) {
  if (toastTimeout) clearTimeout(toastTimeout);
  if (!toast) return;
  
  toast.innerHTML = `
    <span class="text-base">${isSuccess ? '✅' : '❌'}</span>
    <span>${msg}</span>
  `;
  toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-2.5 ${
    isSuccess ? 'bg-slate-900 text-emerald-400 border border-emerald-500/40 shadow-emerald-950/40' : 'bg-red-950 text-red-100 border border-red-500/40'
  }`;
  toast.classList.remove('hidden');
  toastTimeout = setTimeout(() => toast.classList.add('hidden'), 4500);
}

// ─────────────────────────────────────────────────────────────
// AUTHENTICATION & SESSION
// ─────────────────────────────────────────────────────────────

async function checkAuth() {
  const token = getToken();
  if (token) {
    const valid = await verifyToken(token);
    if (valid) {
      showAdminApp();
      return;
    } else {
      sessionStorage.removeItem(SESSION_KEY_TOKEN);
    }
  }
  showLoginScreen();
}

function showLoginScreen() {
  loginScreen.classList.remove('hidden');
  adminApp.classList.add('hidden');
}

function showAdminApp() {
  const token = getToken();
  if (!token) {
    showLoginScreen();
    return;
  }

  loginScreen.classList.add('hidden');
  adminApp.classList.remove('hidden');

  if (syncBadge) {
    syncBadge.textContent = 'GitHub Direct Sync (Live)';
    syncBadge.className = 'ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300';
  }

  loadContent();
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginAlert.classList.add('hidden');

  const token = document.getElementById('gh-token').value.trim();
  const btn = loginForm.querySelector('button[type="submit"]');

  if (!token) {
    loginAlert.textContent = 'GitHub Token wajib diisi.';
    loginAlert.classList.remove('hidden');
    return;
  }

  btn.innerHTML = '<span>Memverifikasi Token...</span>';
  btn.disabled = true;

  const valid = await verifyToken(token);

  if (valid) {
    sessionStorage.setItem(SESSION_KEY_TOKEN, token);
    showAdminApp();
  } else {
    loginAlert.textContent = 'Token tidak valid atau tidak memiliki akses Write ke repository byron-portfolio. Cek kembali izin token Anda.';
    loginAlert.classList.remove('hidden');
    btn.innerHTML = '<span>Masuk ke Dashboard</span><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>';
    btn.disabled = false;
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY_TOKEN);
  state = null;
  showLoginScreen();
});

// ─────────────────────────────────────────────────────────────
// LOAD CONTENT & METRICS
// ─────────────────────────────────────────────────────────────

async function loadContent() {
  showToast('Memuat data portofolio...', true);
  try {
    const token = getToken();
    state = await fetchContent(token);

    if (!state) throw new Error('Data konten tidak dapat dimuat.');
    
    syncGlobalState();
    renderAll();
    showToast('Data portofolio siap dikelola!', true);
  } catch (err) {
    showToast('Gagal memuat data: ' + err.message, false);
  }
}

function updateMetrics() {
  if (!state) return;
  const elProj = document.getElementById('metric-projects');
  const elExp = document.getElementById('metric-exp');
  const elOrg = document.getElementById('metric-org');
  const elCerts = document.getElementById('metric-certs');
  const elSkills = document.getElementById('metric-skills');

  if (elProj) elProj.textContent = (state.projects || []).length;
  if (elExp) elExp.textContent = (state.experiences || []).length;
  if (elOrg) elOrg.textContent = (state.organizations || []).length;
  if (elCerts) elCerts.textContent = (state.certifications || []).length;

  if (elSkills) {
    const s = state.skills || {};
    const count = (s.languages || []).length + (s.frameworks || []).length + (s.softSkills || []).length;
    elSkills.textContent = count;
  }
}

// ─────────────────────────────────────────────────────────────
// SAVE CONTENT TO GITHUB / LOCAL
// ─────────────────────────────────────────────────────────────

async function saveCurrentState(silent = false) {
  updatePersonalState();
  updateSkillsState();

  // Save draft locally
  localStorage.setItem(LOCAL_STORAGE_DRAFT, JSON.stringify(state));

  const token = getToken();
  if (!token) {
    showToast('Sesi GitHub Token habis. Silakan login kembali.', false);
    showLoginScreen();
    return false;
  }

  const btn = document.getElementById('save-all-btn');
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span>⏳ Menyimpan ke GitHub...</span>`;

  try {
    await saveContent(state, token);
    if (!silent) {
      showToast('Perubahan berhasil di-commit ke GitHub!');
    }
    updateMetrics();
    return true;
  } catch (err) {
    showToast('Gagal menyimpan ke GitHub: ' + err.message, false);
    return false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

document.getElementById('save-all-btn').addEventListener('click', async () => {
  await saveCurrentState(false);
});

// ─────────────────────────────────────────────────────────────
// TABS NAVIGATION
// ─────────────────────────────────────────────────────────────

document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.remove('active');
    });
    tab.classList.add('active');

    const target = tab.dataset.tab;
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    const targetContent = document.getElementById(`tab-${target}`);
    if (targetContent) targetContent.classList.remove('hidden');

    if (target === 'raw-json') {
      updateRawJsonEditor();
    }
  });
});

// ─────────────────────────────────────────────────────────────
// RENDER ALL
// ─────────────────────────────────────────────────────────────

function renderAll() {
  if (!state) return;
  renderPersonal();
  renderSkills();
  renderProjects();
  renderExperiences();
  renderOrganizations();
  renderCertifications();
  updateMetrics();
}

// ─────────────────────────────────────────────────────────────
// TAB: PERSONAL
// ─────────────────────────────────────────────────────────────

function renderPersonal() {
  const p = state.personal || {};
  document.getElementById('p-name').value      = p.name      || '';
  document.getElementById('p-title').value     = p.title     || '';
  document.getElementById('p-tagline').value   = p.tagline   || '';
  document.getElementById('p-email').value     = p.email     || '';
  document.getElementById('p-location').value  = p.location  || '';
  document.getElementById('p-linkedin').value  = p.linkedin  || '';
  document.getElementById('p-github').value    = p.github    || '';
  document.getElementById('p-instagram').value = p.instagram || '';
}

function updatePersonalState() {
  if (!state.personal) state.personal = {};
  state.personal.name      = document.getElementById('p-name').value.trim();
  state.personal.title     = document.getElementById('p-title').value.trim();
  state.personal.tagline   = document.getElementById('p-tagline').value.trim();
  state.personal.email     = document.getElementById('p-email').value.trim();
  state.personal.location  = document.getElementById('p-location').value.trim();
  state.personal.linkedin  = document.getElementById('p-linkedin').value.trim();
  state.personal.github    = document.getElementById('p-github').value.trim();
  state.personal.instagram = document.getElementById('p-instagram').value.trim();
}

// ─────────────────────────────────────────────────────────────
// TAB: SKILLS
// ─────────────────────────────────────────────────────────────

function renderSkills() {
  const s = state.skills || {};
  const languagesInput = document.getElementById('skills-languages');
  const frameworksInput = document.getElementById('skills-frameworks');
  const softInput = document.getElementById('skills-soft');

  const langArr = Array.isArray(s.languages) ? s.languages : (s.languages ? s.languages.split(',') : []);
  const frameArr = Array.isArray(s.frameworks) ? s.frameworks : (s.frameworks ? s.frameworks.split(',') : []);
  const softArr = Array.isArray(s.softSkills) ? s.softSkills : (s.softSkills ? s.softSkills.split(',') : []);

  if (languagesInput) languagesInput.value = langArr.join(', ');
  if (frameworksInput) frameworksInput.value = frameArr.join(', ');
  if (softInput) softInput.value = softArr.join(', ');

  renderSkillsPillPreviews(langArr, frameArr, softArr);
}

function renderSkillsPillPreviews(langs, frameworks, softs) {
  const pLang = document.getElementById('preview-skills-languages');
  const pFrame = document.getElementById('preview-skills-frameworks');
  const pSoft = document.getElementById('preview-skills-soft');

  if (pLang) {
    pLang.innerHTML = langs.map(l => `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-sky-deep border border-blue-200">${escHtml(l.trim())}</span>`).join('');
  }
  if (pFrame) {
    pFrame.innerHTML = frameworks.map(f => `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">${escHtml(f.trim())}</span>`).join('');
  }
  if (pSoft) {
    pSoft.innerHTML = softs.map(s => `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">${escHtml(s.trim())}</span>`).join('');
  }
}

function updateSkillsState() {
  if (!state.skills) state.skills = {};
  
  const languagesVal = document.getElementById('skills-languages')?.value || '';
  const frameworksVal = document.getElementById('skills-frameworks')?.value || '';
  const softVal = document.getElementById('skills-soft')?.value || '';

  state.skills.languages = languagesVal.split(',').map(item => item.trim()).filter(Boolean);
  state.skills.frameworks = frameworksVal.split(',').map(item => item.trim()).filter(Boolean);
  state.skills.softSkills = softVal.split(',').map(item => item.trim()).filter(Boolean);

  renderSkillsPillPreviews(state.skills.languages, state.skills.frameworks, state.skills.softSkills);
  updateMetrics();
}

['skills-languages', 'skills-frameworks', 'skills-soft'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateSkillsState);
});

// ─────────────────────────────────────────────────────────────
// TAB: PROJECTS (Full Media Upload for Cover & Card Stack Gallery)
// ─────────────────────────────────────────────────────────────

const searchInput = document.getElementById('project-search-input');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    projectSearchQuery = e.target.value.toLowerCase().trim();
    renderProjects();
  });
}

function renderProjects() {
  const list = document.getElementById('projects-list');
  if (!list || !state) return;

  const projects = state.projects || [];
  
  const filteredProjects = projects.map((p, idx) => ({ ...p, originalIdx: idx }))
    .filter(p => {
      if (!projectSearchQuery) return true;
      const t = (p.title || '').toLowerCase();
      const st = (p.subtitle || '').toLowerCase();
      const stackStr = (p.stack || []).join(' ').toLowerCase();
      return t.includes(projectSearchQuery) || st.includes(projectSearchQuery) || stackStr.includes(projectSearchQuery);
    });

  if (filteredProjects.length === 0) {
    list.innerHTML = `
      <div class="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-sm">
        Tidak ada proyek yang cocok dengan kata kunci "${escHtml(projectSearchQuery)}".
      </div>
    `;
    return;
  }

  list.innerHTML = filteredProjects.map(proj => {
    const idx = proj.originalIdx;
    const isExpanded = expandedProjectId === idx;
    const images = proj.images && proj.images.length > 0 ? proj.images : (proj.image ? [proj.image] : []);
    const stack = proj.stack || [];
    const highlights = proj.highlights || [];
    const mainImg = proj.image || (images[0] || '');

    return `
      <div class="item-card bg-slate-50/70 rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        
        <!-- Header Bar -->
        <div class="px-5 py-4 bg-white flex items-center justify-between gap-4 cursor-pointer select-none"
          onclick="toggleProjectExpand(${idx})">
          
          <div class="flex items-center gap-3.5 min-w-0">
            <div class="w-14 h-11 rounded-xl bg-slate-900 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5">
              ${mainImg ? `<img src="${mainImg}" class="w-full h-full object-contain thumb-preview" onerror="this.src='../favicon.svg'">` : `<span class="text-xl">💻</span>`}
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-sky-deep border border-sky-deep/20 font-mono">#${idx + 1}</span>
                <h3 class="font-bold text-slate-800 text-sm sm:text-base truncate">${escHtml(proj.title || 'Proyek Tanpa Judul')}</h3>
                ${images.length > 1 ? `<span class="text-[11px] font-semibold text-slate-400 hidden sm:inline">(${images.length} Galeri)</span>` : ''}
              </div>
              <p class="text-xs text-slate-500 truncate mt-0.5">${escHtml(proj.subtitle || 'Belum ada subtitle')}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0" onclick="event.stopPropagation()">
            <!-- Sort Reorder Buttons -->
            <button type="button" onclick="moveProject(${idx}, -1)" title="Geser ke Atas"
              class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}" ${idx === 0 ? 'disabled' : ''}>
              ▲
            </button>
            <button type="button" onclick="moveProject(${idx}, 1)" title="Geser ke Bawah"
              class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition ${idx === projects.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}" ${idx === projects.length - 1 ? 'disabled' : ''}>
              ▼
            </button>
            <button type="button" onclick="removeProject(${idx})" title="Hapus Proyek"
              class="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition">
              🗑 Hapus
            </button>
            <button type="button" onclick="toggleProjectExpand(${idx})"
              class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition">
              ${isExpanded ? '▲' : '▼'}
            </button>
          </div>
        </div>

        <!-- Expanded Form Body -->
        <div class="p-5 sm:p-6 space-y-5 border-t border-slate-200 ${isExpanded ? 'block' : 'hidden'}">
          
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Judul Sistem / Proyek</label>
              <input type="text" value="${escHtml(proj.title || '')}"
                oninput="state.projects[${idx}].title = this.value"
                class="${inputCls}" placeholder="Nama Proyek">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subjudul / Ringkasan 1 Baris</label>
              <input type="text" value="${escHtml(proj.subtitle || '')}"
                oninput="state.projects[${idx}].subtitle = this.value"
                class="${inputCls}" placeholder="Sistem Manajemen Sparepart Dealer Yamaha">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Periode Pengerjaan</label>
              <input type="text" value="${escHtml(proj.period || '')}"
                oninput="state.projects[${idx}].period = this.value"
                class="${inputCls}" placeholder="2024 – Sekarang">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Dampak Bisnis (Business Impact)</label>
              <input type="text" value="${escHtml(proj.impact || '')}"
                oninput="state.projects[${idx}].impact = this.value"
                class="${inputCls}" placeholder="Mendigitalkan dan mempercepat proses bisnis...">
            </div>
          </div>

          <!-- Links -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">GitHub Repository Link</label>
              <input type="url" value="${escHtml(proj.github || '')}"
                oninput="state.projects[${idx}].github = this.value"
                class="${inputCls}" placeholder="https://github.com/robbyhdayatt/...">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Live Demo / Website Link</label>
              <input type="url" value="${escHtml(proj.link || '')}"
                oninput="state.projects[${idx}].link = this.value"
                class="${inputCls}" placeholder="https://...">
            </div>
          </div>

          <!-- Cover Image Section (With Direct Upload) -->
          <div class="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Foto Cover Utama (Thumbnail Card Depan)</label>
              <span class="text-[11px] text-emerald-600 font-semibold">Tersinkron otomatis ke slide 1</span>
            </div>
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div class="w-20 h-14 rounded-xl bg-slate-900 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-xs p-1">
                <img src="${mainImg || '../favicon.svg'}" class="w-full h-full object-contain" onerror="this.src='../favicon.svg'">
              </div>
              <input type="text" id="cover-input-${idx}" value="${escHtml(proj.image || '')}"
                oninput="state.projects[${idx}].image = this.value"
                placeholder="./assets/images/... atau https://..." class="${inputCls} flex-1 font-mono text-xs">
              
              <input type="file" id="file-cover-${idx}" class="hidden" accept="image/*"
                onchange="handleCoverUpload(this, ${idx})">
              <button type="button" onclick="document.getElementById('file-cover-${idx}').click()"
                class="px-4 py-2.5 bg-sky-deep hover:bg-blue-700 text-white text-xs font-bold rounded-xl whitespace-nowrap transition flex items-center gap-1.5 shadow-xs">
                <span>📷 Upload Cover Baru</span>
              </button>
            </div>
          </div>

          <!-- Multiple Gallery Images Manager (Card Stack Deck Gallery with Upload for each) -->
          <div class="p-4 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Galeri Tumpukan Gambar (Pop-up Modal Deck)</label>
                <p class="text-[11px] text-slate-400">Setiap gambar di bawah ini akan tampil sebagai kartu tumpukan interaktif di modal detail.</p>
              </div>
              
              <div class="flex items-center gap-2">
                <input type="file" id="file-add-gallery-${idx}" class="hidden" accept="image/*"
                  onchange="handleGalleryUploadNew(this, ${idx})">
                <button type="button" onclick="document.getElementById('file-add-gallery-${idx}').click()"
                  class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5">
                  <span>📷 Upload Gambar Baru</span>
                </button>
                <button type="button" onclick="addGalleryImage(${idx})"
                  class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">
                  + Input Path/URL
                </button>
              </div>
            </div>

            <!-- Gallery Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5" id="gallery-grid-${idx}">
              ${images.map((imgUrl, imgIdx) => `
                <div class="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col gap-2.5 relative shadow-xs">
                  
                  <!-- Top Badge & Reorder Controls -->
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">Slide #${imgIdx + 1}</span>
                    <div class="flex items-center gap-1">
                      <button type="button" onclick="moveGalleryImage(${idx}, ${imgIdx}, -1)" title="Geser ke Kiri"
                        class="w-6 h-6 rounded-md bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs shadow-2xs ${imgIdx === 0 ? 'opacity-30 cursor-not-allowed' : ''}" ${imgIdx === 0 ? 'disabled' : ''}>◀</button>
                      <button type="button" onclick="moveGalleryImage(${idx}, ${imgIdx}, 1)" title="Geser ke Kanan"
                        class="w-6 h-6 rounded-md bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs shadow-2xs ${imgIdx === images.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}" ${imgIdx === images.length - 1 ? 'disabled' : ''}>▶</button>
                      <button type="button" onclick="removeGalleryImage(${idx}, ${imgIdx})" title="Hapus Gambar Ini"
                        class="w-6 h-6 rounded-md bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center ml-1">
                        ×
                      </button>
                    </div>
                  </div>

                  <!-- Image Preview Box -->
                  <div class="w-full h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 relative group flex items-center justify-center p-1.5">
                    <img src="${imgUrl}" class="w-full h-full object-contain thumb-preview" onerror="this.src='../favicon.svg'">
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span class="text-white text-xs font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs">Pratinjau Slide ${imgIdx + 1}</span>
                    </div>
                  </div>

                  <!-- Path Input + Replace Upload Button -->
                  <div class="flex items-center gap-1.5">
                    <input type="text" value="${escHtml(imgUrl)}"
                      onchange="updateGalleryImage(${idx}, ${imgIdx}, this.value)"
                      placeholder="./assets/images/..."
                      class="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg w-full font-mono outline-none focus:border-sky-deep bg-white">
                    
                    <input type="file" id="file-gallery-${idx}-${imgIdx}" class="hidden" accept="image/*"
                      onchange="handleGalleryUploadReplace(this, ${idx}, ${imgIdx})">
                    <button type="button" onclick="document.getElementById('file-gallery-${idx}-${imgIdx}').click()"
                      title="Ganti gambar ini dengan mengunggah file baru"
                      class="px-2.5 py-1.5 bg-sky-deep hover:bg-blue-700 text-white rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1 shadow-2xs">
                      <span>📷</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Tech Stack Tag Manager -->
          <div class="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Tech Stack (Badge Logo Otomatis)</label>
            
            <!-- Stack Pills -->
            <div class="flex flex-wrap gap-1.5" id="stack-pills-${idx}">
              ${stack.map((t, tIdx) => `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-xs font-semibold border border-slate-200">
                  <span>${escHtml(t)}</span>
                  <button type="button" onclick="removeStackTag(${idx}, ${tIdx})" class="text-slate-400 hover:text-red-500 font-bold ml-1">×</button>
                </span>
              `).join('')}
            </div>

            <!-- Add Stack Input & Quick Suggestions -->
            <div class="flex items-center gap-2 pt-1">
              <input type="text" id="input-new-stack-${idx}" placeholder="Ketik nama teknologi lalu tekan Enter atau klik Tambah"
                class="${inputCls}" onkeydown="if(event.key==='Enter'){event.preventDefault(); addStackTagFromInput(${idx});}">
              <button type="button" onclick="addStackTagFromInput(${idx})"
                class="px-4 py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-xl whitespace-nowrap transition">
                + Tambah
              </button>
            </div>

            <!-- Quick Suggestions -->
            <div class="flex flex-wrap items-center gap-1 text-[11px] text-slate-400 pt-1">
              <span>Saran Cepat:</span>
              ${COMMON_TECH_SUGGESTIONS.slice(0, 10).map(s => `
                <button type="button" onclick="addQuickStackTag(${idx}, '${s}')"
                  class="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-sky-deep rounded-md text-slate-600 transition">
                  + ${s}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Deskripsi Lengkap Sistem</label>
            <textarea rows="3" oninput="state.projects[${idx}].description = this.value"
              class="${inputCls} leading-relaxed" placeholder="Deskripsi arsitektur dan kegunaan sistem...">${escHtml(proj.description || '')}</textarea>
          </div>

          <!-- Highlights (Feature bullet points) -->
          <div class="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Fitur &amp; Spesifikasi Utama (Highlights)</label>
              <button type="button" onclick="addHighlight(${idx})"
                class="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-sky-deep text-xs font-bold rounded-lg transition">
                + Tambah Poin
              </button>
            </div>
            
            <div class="space-y-2">
              ${highlights.map((h, hIdx) => `
                <div class="flex items-center gap-2">
                  <span class="text-xs text-sky-deep font-bold">✓</span>
                  <input type="text" value="${escHtml(h)}"
                    oninput="state.projects[${idx}].highlights[${hIdx}] = this.value"
                    class="${inputCls} flex-1" placeholder="Poin keunggulan sistem...">
                  <button type="button" onclick="removeHighlight(${idx}, ${hIdx})"
                    class="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1">
                    🗑
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    `;
  }).join('');
}

window.toggleProjectExpand = (idx) => {
  expandedProjectId = expandedProjectId === idx ? null : idx;
  renderProjects();
};

window.moveProject = async (idx, dir) => {
  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= state.projects.length) return;
  const temp = state.projects[idx];
  state.projects[idx] = state.projects[targetIdx];
  state.projects[targetIdx] = temp;
  if (expandedProjectId === idx) expandedProjectId = targetIdx;
  renderProjects();
  showToast(`Urutan proyek diperbarui! Klik "Simpan Perubahan" untuk mempublikasikan.`);
};

window.removeProject = (idx) => {
  const p = state.projects[idx];
  if (!confirm(`Apakah Anda yakin ingin menghapus proyek "${p?.title}"?`)) return;
  state.projects.splice(idx, 1);
  expandedProjectId = null;
  renderProjects();
  updateMetrics();
  showToast(`Proyek telah dihapus. Klik "Simpan Perubahan" untuk mempublikasikan.`);
};

document.getElementById('add-project-btn').addEventListener('click', () => {
  if (!state.projects) state.projects = [];
  const newProj = {
    title: 'Proyek Baru',
    subtitle: 'Deskripsi singkat sistem',
    period: '2026',
    image: './assets/images/spartan-preview.jpg',
    images: ['./assets/images/spartan-preview.jpg'],
    stack: ['Laravel', 'MySQL'],
    highlights: ['Fitur unggulan sistem 1', 'Fitur unggulan sistem 2'],
    description: 'Deskripsi lengkap mengenai sistem ini...',
    impact: 'Dampak bisnis atau efisiensi operasional.',
    github: '',
    link: ''
  };
  state.projects.unshift(newProj);
  expandedProjectId = 0;
  renderProjects();
  updateMetrics();
  showToast(`Proyek baru ditambahkan di urutan teratas.`);
});

// Gallery Image Operations
window.addGalleryImage = (projIdx) => {
  if (!state.projects[projIdx].images) state.projects[projIdx].images = [];
  state.projects[projIdx].images.push('./assets/images/spartan-preview.jpg');
  renderProjects();
};

window.updateGalleryImage = (projIdx, imgIdx, val) => {
  if (!state.projects[projIdx].images) state.projects[projIdx].images = [];
  state.projects[projIdx].images[imgIdx] = val.trim();
  if (imgIdx === 0) {
    state.projects[projIdx].image = val.trim();
  }
  renderProjects();
};

window.removeGalleryImage = (projIdx, imgIdx) => {
  state.projects[projIdx].images.splice(imgIdx, 1);
  if (state.projects[projIdx].images.length > 0) {
    state.projects[projIdx].image = state.projects[projIdx].images[0];
  }
  renderProjects();
};

window.moveGalleryImage = (projIdx, imgIdx, dir) => {
  const images = state.projects[projIdx].images || [];
  const targetIdx = imgIdx + dir;
  if (targetIdx < 0 || targetIdx >= images.length) return;
  
  const temp = images[imgIdx];
  images[imgIdx] = images[targetIdx];
  images[targetIdx] = temp;
  
  // If first image changed, sync cover
  state.projects[projIdx].image = images[0];
  
  renderProjects();
};

// Stack Tag Operations
window.addStackTagFromInput = (projIdx) => {
  const input = document.getElementById(`input-new-stack-${projIdx}`);
  if (!input || !input.value.trim()) return;
  if (!state.projects[projIdx].stack) state.projects[projIdx].stack = [];
  state.projects[projIdx].stack.push(input.value.trim());
  input.value = '';
  renderProjects();
};

window.addQuickStackTag = (projIdx, tagName) => {
  if (!state.projects[projIdx].stack) state.projects[projIdx].stack = [];
  if (!state.projects[projIdx].stack.includes(tagName)) {
    state.projects[projIdx].stack.push(tagName);
    renderProjects();
  }
};

window.removeStackTag = (projIdx, tIdx) => {
  state.projects[projIdx].stack.splice(tIdx, 1);
  renderProjects();
};

// Highlight Operations
window.addHighlight = (projIdx) => {
  if (!state.projects[projIdx].highlights) state.projects[projIdx].highlights = [];
  state.projects[projIdx].highlights.push('Poin keunggulan baru');
  renderProjects();
};

window.removeHighlight = (projIdx, hIdx) => {
  state.projects[projIdx].highlights.splice(hIdx, 1);
  renderProjects();
};

// ─────────────────────────────────────────────────────────────
// DIRECT IMAGE UPLOAD HANDLERS (COVER & GALLERY)
// ─────────────────────────────────────────────────────────────

// Handle Cover Image Upload
window.handleCoverUpload = async (fileInput, projIdx) => {
  if (!fileInput.files?.[0]) return;
  const token = getToken();

  if (!token) {
    showToast('Sesi token tidak ditemukan. Silakan login kembali.', false);
    showLoginScreen();
    return;
  }

  showToast('Mengunggah foto cover utama ke GitHub...', true);
  try {
    const url = await uploadImage(fileInput.files[0], token);
    
    // Update main cover property
    state.projects[projIdx].image = url;
    
    // Also synchronize the first image in images array
    if (!state.projects[projIdx].images) state.projects[projIdx].images = [];
    if (state.projects[projIdx].images.length === 0) {
      state.projects[projIdx].images.push(url);
    } else {
      state.projects[projIdx].images[0] = url;
    }
    
    renderProjects();

    // Auto-commit content.json so live website updates immediately!
    showToast('Menyimpan perubahan ke website live...', true);
    await saveContent(state, token);
    showToast('✅ Foto cover berhasil diunggah & langsung aktif di website!');
  } catch (err) {
    showToast('Gagal upload: ' + err.message, false);
  } finally {
    fileInput.value = '';
  }
};

// Handle New Gallery Image Upload
window.handleGalleryUploadNew = async (fileInput, projIdx) => {
  if (!fileInput.files?.[0]) return;
  const token = getToken();

  if (!token) {
    showToast('Sesi token tidak ditemukan. Silakan login kembali.', false);
    showLoginScreen();
    return;
  }

  showToast('Mengunggah gambar slide baru ke GitHub...', true);
  try {
    const url = await uploadImage(fileInput.files[0], token);
    
    if (!state.projects[projIdx].images) state.projects[projIdx].images = [];
    state.projects[projIdx].images.push(url);
    
    // If project image was empty, set it
    if (!state.projects[projIdx].image) {
      state.projects[projIdx].image = url;
    }
    
    renderProjects();

    // Auto-commit content.json
    showToast('Menyimpan perubahan ke website live...', true);
    await saveContent(state, token);
    showToast('✅ Gambar galeri baru berhasil diunggah & aktif di website!');
  } catch (err) {
    showToast('Gagal upload: ' + err.message, false);
  } finally {
    fileInput.value = '';
  }
};

// Handle Replace Gallery Image Upload
window.handleGalleryUploadReplace = async (fileInput, projIdx, imgIdx) => {
  if (!fileInput.files?.[0]) return;
  const token = getToken();

  if (!token) {
    showToast('Sesi token tidak ditemukan. Silakan login kembali.', false);
    showLoginScreen();
    return;
  }

  showToast(`Mengunggah gambar pengganti slide #${imgIdx + 1} ke GitHub...`, true);
  try {
    const url = await uploadImage(fileInput.files[0], token);
    
    if (!state.projects[projIdx].images) state.projects[projIdx].images = [];
    state.projects[projIdx].images[imgIdx] = url;
    
    // If it was the 1st image, also update cover image
    if (imgIdx === 0) {
      state.projects[projIdx].image = url;
    }
    
    renderProjects();

    // Auto-commit content.json
    showToast('Menyimpan perubahan ke website live...', true);
    await saveContent(state, token);
    showToast(`✅ Slide #${imgIdx + 1} berhasil diganti & aktif di website!`);
  } catch (err) {
    showToast('Gagal upload: ' + err.message, false);
  } finally {
    fileInput.value = '';
  }
};

// ─────────────────────────────────────────────────────────────
// TAB: EXPERIENCES
// ─────────────────────────────────────────────────────────────

function renderExperiences() {
  const list = document.getElementById('exp-list');
  if (!list || !state) return;

  const experiences = state.experiences || [];
  list.innerHTML = experiences.map((exp, idx) => `
    <div class="item-card bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">#${idx + 1}</span>
          <span class="font-bold text-sm text-slate-800">${escHtml(exp.role || '')} @ ${escHtml(exp.company || '')}</span>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" onclick="moveExp(${idx}, -1)" class="w-6 h-6 rounded bg-slate-200 text-slate-700 font-bold text-xs" ${idx === 0 ? 'disabled' : ''}>▲</button>
          <button type="button" onclick="moveExp(${idx}, 1)" class="w-6 h-6 rounded bg-slate-200 text-slate-700 font-bold text-xs" ${idx === experiences.length - 1 ? 'disabled' : ''}>▼</button>
          <button type="button" onclick="removeExp(${idx})" class="text-xs font-bold text-red-600 hover:underline ml-2">🗑 Hapus</button>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" value="${escHtml(exp.role || '')}"
          oninput="state.experiences[${idx}].role = this.value"
          placeholder="Posisi / Role" class="${inputCls}">
        <input type="text" value="${escHtml(exp.company || '')}"
          oninput="state.experiences[${idx}].company = this.value"
          placeholder="Perusahaan / Tempat Kerja" class="${inputCls}">
        <input type="text" value="${escHtml(exp.period || '')}"
          oninput="state.experiences[${idx}].period = this.value"
          placeholder="Periode (contoh: 2024 – Sekarang)" class="${inputCls}">
        <input type="text" value="${escHtml(exp.type || '')}"
          oninput="state.experiences[${idx}].type = this.value"
          placeholder="Tipe (Fulltime, Magang, Kontrak)" class="${inputCls}">
        <textarea rows="2" oninput="state.experiences[${idx}].description = this.value"
          placeholder="Deskripsi tugas dan tanggung jawab..."
          class="sm:col-span-2 ${inputCls}">${escHtml(exp.description || '')}</textarea>
      </div>
    </div>
  `).join('');
}

window.moveExp = (idx, dir) => {
  const target = idx + dir;
  if (target < 0 || target >= state.experiences.length) return;
  const temp = state.experiences[idx];
  state.experiences[idx] = state.experiences[target];
  state.experiences[target] = temp;
  renderExperiences();
};

window.removeExp = (idx) => {
  if (!confirm(`Hapus pengalaman "${state.experiences[idx]?.role}"?`)) return;
  state.experiences.splice(idx, 1);
  renderExperiences();
  updateMetrics();
};

document.getElementById('add-exp-btn').addEventListener('click', () => {
  if (!state.experiences) state.experiences = [];
  state.experiences.unshift({ role: 'Posisi Baru', company: 'Perusahaan', period: '2026', type: 'Fulltime', description: '' });
  renderExperiences();
  updateMetrics();
});

// ─────────────────────────────────────────────────────────────
// TAB: ORGANIZATIONS
// ─────────────────────────────────────────────────────────────

function renderOrganizations() {
  const list = document.getElementById('org-list');
  if (!list || !state) return;

  const organizations = state.organizations || [];
  list.innerHTML = organizations.map((org, idx) => `
    <div class="item-card bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">#${idx + 1}</span>
          <span class="font-bold text-sm text-slate-800">${escHtml(org.role || '')} — ${escHtml(org.organization || '')}</span>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" onclick="moveOrg(${idx}, -1)" class="w-6 h-6 rounded bg-slate-200 text-slate-700 font-bold text-xs" ${idx === 0 ? 'disabled' : ''}>▲</button>
          <button type="button" onclick="moveOrg(${idx}, 1)" class="w-6 h-6 rounded bg-slate-200 text-slate-700 font-bold text-xs" ${idx === organizations.length - 1 ? 'disabled' : ''}>▼</button>
          <button type="button" onclick="removeOrg(${idx})" class="text-xs font-bold text-red-600 hover:underline ml-2">🗑 Hapus</button>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" value="${escHtml(org.role || '')}"
          oninput="state.organizations[${idx}].role = this.value"
          placeholder="Jabatan (Ketua Umum, Anggota, dll)" class="${inputCls}">
        <input type="text" value="${escHtml(org.organization || '')}"
          oninput="state.organizations[${idx}].organization = this.value"
          placeholder="Nama Organisasi" class="${inputCls}">
        <input type="text" value="${escHtml(org.period || '')}"
          oninput="state.organizations[${idx}].period = this.value"
          placeholder="Periode (contoh: 2022 – 2023)" class="sm:col-span-2 ${inputCls}">
        <textarea rows="2" oninput="state.organizations[${idx}].description = this.value"
          placeholder="Deskripsi peran dan pencapaian..."
          class="sm:col-span-2 ${inputCls}">${escHtml(org.description || '')}</textarea>
      </div>
    </div>
  `).join('');
}

window.moveOrg = (idx, dir) => {
  const target = idx + dir;
  if (target < 0 || target >= state.organizations.length) return;
  const temp = state.organizations[idx];
  state.organizations[idx] = state.organizations[target];
  state.organizations[target] = temp;
  renderOrganizations();
};

window.removeOrg = (idx) => {
  if (!confirm(`Hapus organisasi "${state.organizations[idx]?.role}"?`)) return;
  state.organizations.splice(idx, 1);
  renderOrganizations();
  updateMetrics();
};

document.getElementById('add-org-btn').addEventListener('click', () => {
  if (!state.organizations) state.organizations = [];
  state.organizations.unshift({ role: 'Jabatan Baru', organization: 'Nama Organisasi', period: '2026', description: '' });
  renderOrganizations();
  updateMetrics();
});

// ─────────────────────────────────────────────────────────────
// TAB: CERTIFICATIONS
// ─────────────────────────────────────────────────────────────

function renderCertifications() {
  const list = document.getElementById('cert-list');
  if (!list || !state) return;

  const certifications = state.certifications || [];
  list.innerHTML = certifications.map((cert, idx) => `
    <div class="item-card bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">#${idx + 1}</span>
          <span class="font-bold text-sm text-slate-800">${escHtml(cert.title || '')} (${escHtml(cert.issuer || '')})</span>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" onclick="moveCert(${idx}, -1)" class="w-6 h-6 rounded bg-slate-200 text-slate-700 font-bold text-xs" ${idx === 0 ? 'disabled' : ''}>▲</button>
          <button type="button" onclick="moveCert(${idx}, 1)" class="w-6 h-6 rounded bg-slate-200 text-slate-700 font-bold text-xs" ${idx === certifications.length - 1 ? 'disabled' : ''}>▼</button>
          <button type="button" onclick="removeCert(${idx})" class="text-xs font-bold text-red-600 hover:underline ml-2">🗑 Hapus</button>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" value="${escHtml(cert.title || '')}"
          oninput="state.certifications[${idx}].title = this.value"
          placeholder="Nama Sertifikasi / Pelatihan" class="${inputCls}">
        <input type="text" value="${escHtml(cert.issuer || '')}"
          oninput="state.certifications[${idx}].issuer = this.value"
          placeholder="Penerbit / Penyelenggara (IBM, Dicoding, dll)" class="${inputCls}">
        <input type="text" value="${escHtml(cert.year || '')}"
          oninput="state.certifications[${idx}].year = this.value"
          placeholder="Tahun" class="${inputCls}">
        
        <!-- Foto Sertifikat (Uploader & Preview) -->
        <div class="sm:col-span-2 bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>🖼️</span> Foto / Scan Sertifikat (Muncul di Pop-up)
            </span>
            ${cert.image ? `
              <button type="button" onclick="state.certifications[${idx}].image = ''; renderCertifications();" class="text-xs text-red-500 hover:underline font-semibold">Hapus Foto</button>
            ` : ''}
          </div>
          <div class="flex items-center gap-3">
            ${cert.image ? `
              <a href="${escHtml(cert.image)}" target="_blank" class="w-20 h-14 rounded-lg border border-slate-200 overflow-hidden shrink-0 bg-slate-900 flex items-center justify-center hover:opacity-90 transition group relative" title="Klik untuk pratinjau">
                <img src="${escHtml(cert.image)}" class="w-full h-full object-contain" />
              </a>
            ` : `
              <div class="w-20 h-14 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-2xs shrink-0">
                <span>Belum Ada</span>
                <span>Foto</span>
              </div>
            `}
            <div class="flex-1 space-y-1.5">
              <div class="flex items-center gap-2">
                <label class="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold hover:bg-indigo-100 transition shadow-2xs">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  Upload Foto Sertifikat
                  <input type="file" accept="image/*" class="hidden" onchange="handleCertUpload(this, ${idx})">
                </label>
                <span class="text-xs text-slate-400">atau URL langsung:</span>
              </div>
              <input type="text" value="${escHtml(cert.image || '')}"
                oninput="state.certifications[${idx}].image = this.value"
                placeholder="https://raw.githubusercontent.com/... atau URL foto" class="${inputCls} text-xs py-1.5">
            </div>
          </div>
        </div>

        <textarea rows="2" oninput="state.certifications[${idx}].description = this.value"
          placeholder="Keterangan kompetensi..."
          class="sm:col-span-2 ${inputCls}">${escHtml(cert.description || '')}</textarea>
      </div>
    </div>
  `).join('');
}

window.handleCertUpload = async (fileInput, certIdx) => {
  if (!fileInput.files?.[0]) return;
  const token = getToken();

  if (!token) {
    showToast('Sesi token tidak ditemukan. Silakan login kembali.', false);
    showLoginScreen();
    return;
  }

  showToast('Mengunggah foto sertifikat ke GitHub...', true);
  try {
    const url = await uploadImage(fileInput.files[0], token);
    state.certifications[certIdx].image = url;
    renderCertifications();

    showToast('Menyimpan perubahan ke website live...', true);
    await saveContent(state, token);
    showToast('✅ Foto sertifikat berhasil diunggah & langsung aktif!');
  } catch (err) {
    showToast('Gagal upload: ' + err.message, false);
  } finally {
    fileInput.value = '';
  }
};

window.moveCert = (idx, dir) => {
  const target = idx + dir;
  if (target < 0 || target >= state.certifications.length) return;
  const temp = state.certifications[idx];
  state.certifications[idx] = state.certifications[target];
  state.certifications[target] = temp;
  renderCertifications();
};

window.removeCert = (idx) => {
  if (!confirm(`Hapus sertifikasi "${state.certifications[idx]?.title}"?`)) return;
  state.certifications.splice(idx, 1);
  renderCertifications();
  updateMetrics();
};

document.getElementById('add-cert-btn').addEventListener('click', () => {
  if (!state.certifications) state.certifications = [];
  state.certifications.unshift({ title: 'Sertifikasi Baru', issuer: 'Penyelenggara', year: '2026', image: '', description: '' });
  renderCertifications();
  updateMetrics();
});

// ─────────────────────────────────────────────────────────────
// TAB: RAW JSON EDITOR & BACKUP TOOLS
// ─────────────────────────────────────────────────────────────

function updateRawJsonEditor() {
  const editor = document.getElementById('raw-json-editor');
  if (editor && state) {
    editor.value = JSON.stringify(state, null, 2);
  }
}

const btnFormatJson = document.getElementById('btn-format-json');
if (btnFormatJson) {
  btnFormatJson.addEventListener('click', () => {
    const editor = document.getElementById('raw-json-editor');
    try {
      const parsed = JSON.parse(editor.value);
      editor.value = JSON.stringify(parsed, null, 2);
      showToast('JSON berhasil diformat rapi!');
    } catch (e) {
      showToast('Format JSON salah: ' + e.message, false);
    }
  });
}

const btnApplyJson = document.getElementById('btn-apply-json');
if (btnApplyJson) {
  btnApplyJson.addEventListener('click', async () => {
    const editor = document.getElementById('raw-json-editor');
    try {
      const parsed = JSON.parse(editor.value);
      state = parsed;
      syncGlobalState();
      renderAll();
      showToast('JSON berhasil diterapkan ke seluruh formulir studio!');
      await saveCurrentState(false);
    } catch (e) {
      showToast('Gagal menerapkan JSON: ' + e.message, false);
    }
  });
}

function downloadJsonBackup() {
  if (!state) return;
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `byron_content_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const btnDownloadJson = document.getElementById('btn-download-json');
if (btnDownloadJson) {
  btnDownloadJson.addEventListener('click', () => {
    downloadJsonBackup();
    showToast('File backup JSON berhasil diunduh!');
  });
}

const jsonFileInput = document.getElementById('json-file-input');
if (jsonFileInput) {
  jsonFileInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        state = parsed;
        syncGlobalState();
        renderAll();
        updateRawJsonEditor();
        showToast('Data dari file JSON berhasil diimpor! Klik "Simpan Perubahan" untuk mempublikasikan.');
      } catch (err) {
        showToast('File bukan JSON valid: ' + err.message, false);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });
}

// ─────────────────────────────────────────────────────────────
// HELPERS & EXPORTS
// ─────────────────────────────────────────────────────────────

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-deep focus:ring-2 focus:ring-sky-deep/15 outline-none transition text-sm font-medium bg-white text-slate-800 shadow-2xs';

function syncGlobalState() {
  window.state = state;
}

// Global expose
window.state = state;
window.renderProjects = renderProjects;
window.renderExperiences = renderExperiences;
window.renderOrganizations = renderOrganizations;
window.renderCertifications = renderCertifications;

// Auto-save local draft every 30s
setInterval(() => {
  if (state) {
    localStorage.setItem(LOCAL_STORAGE_DRAFT, JSON.stringify(state));
  }
}, 30000);

// ─────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────

checkAuth();
