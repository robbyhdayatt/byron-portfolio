/**
 * admin.js
 * Byron Portfolio — Admin CMS (Full JavaScript, No PHP)
 * Uses GitHub API for read/write and Imgbb for image uploads.
 */

import { fetchContent, saveContent, uploadImage, verifyToken } from '../scripts/github-cms.js';

// ─────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────

let state = null; // Full content.json object in memory
const SESSION_KEY_TOKEN  = 'byron_gh_token';

const getToken  = () => sessionStorage.getItem(SESSION_KEY_TOKEN);

// ─────────────────────────────────────────────────────────────
// DOM REFS
// ─────────────────────────────────────────────────────────────

const loginScreen  = document.getElementById('login-screen');
const adminApp     = document.getElementById('admin-app');
const loginForm    = document.getElementById('login-form');
const loginAlert   = document.getElementById('login-alert');
const toast        = document.getElementById('toast');
let toastTimeout   = null;

// ─────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────

function showToast(msg, isSuccess = true) {
  if (toastTimeout) clearTimeout(toastTimeout);
  toast.textContent = msg;
  toast.className = `fixed bottom-6 right-6 z-40 px-6 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all duration-300 ${
    isSuccess ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
  }`;
  toast.classList.remove('hidden');
  toastTimeout = setTimeout(() => toast.classList.add('hidden'), 3500);
}

// ─────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────

async function checkAuth() {
  const token = getToken();
  if (token) {
    const valid = await verifyToken(token);
    if (valid) {
      showAdminApp();
      return;
    } else {
      // Token stored but invalid (expired/revoked)
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
  loginScreen.classList.add('hidden');
  adminApp.classList.remove('hidden');
  loadContent();
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginAlert.classList.add('hidden');

  const token   = document.getElementById('gh-token').value.trim();
  const btn     = loginForm.querySelector('button[type="submit"]');

  if (!token) {
    loginAlert.textContent = 'GitHub Token wajib diisi.';
    loginAlert.classList.remove('hidden');
    return;
  }

  btn.textContent = 'Memverifikasi...';
  btn.disabled    = true;

  const valid = await verifyToken(token);

  if (valid) {
    sessionStorage.setItem(SESSION_KEY_TOKEN, token);
    showAdminApp();
  } else {
    loginAlert.textContent = 'Token tidak valid atau tidak punya akses ke repo ini. Cek kembali token-mu.';
    loginAlert.classList.remove('hidden');
    btn.textContent = 'Masuk Dashboard →';
    btn.disabled    = false;
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY_TOKEN);
  state = null;
  showLoginScreen();
});

// ─────────────────────────────────────────────────────────────
// LOAD CONTENT
// ─────────────────────────────────────────────────────────────

async function loadContent() {
  showToast('Memuat data...', true);
  try {
    const token = getToken();
    state = await fetchContent(token);
    if (!state) throw new Error('Konten tidak ditemukan.');
    renderAll();
    showToast('Data berhasil dimuat!', true);
  } catch (err) {
    showToast('Gagal memuat data: ' + err.message, false);
  }
}

// ─────────────────────────────────────────────────────────────
// SAVE ALL
// ─────────────────────────────────────────────────────────────

document.getElementById('save-all-btn').addEventListener('click', async () => {
  const token = getToken();
  if (!token) { showToast('Sesi habis, silakan login ulang.', false); showLoginScreen(); return; }

  updatePersonalState();
  updateSkillsState();

  const btn = document.getElementById('save-all-btn');
  btn.disabled    = true;
  btn.textContent = '⏳ Menyimpan...';

  try {
    await saveContent(state, token);
    showToast('✅ Perubahan berhasil disimpan! (commit baru dibuat di GitHub)');
  } catch (err) {
    showToast('❌ Gagal menyimpan: ' + err.message, false);
  } finally {
    btn.disabled    = false;
    btn.innerHTML   = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg> Simpan Perubahan`;
  }
});

// ─────────────────────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────────────────────

document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.remove('bg-sky-deep', 'text-white', 'shadow-md');
      t.classList.add('text-gray-700', 'hover:bg-white');
    });
    tab.classList.add('bg-sky-deep', 'text-white', 'shadow-md');
    tab.classList.remove('text-gray-700', 'hover:bg-white');

    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.getElementById(`tab-${tab.dataset.tab}`).classList.remove('hidden');
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
}

// ─────────────────────────────────────────────────────────────
// PERSONAL
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
  state.personal.name      = document.getElementById('p-name').value;
  state.personal.title     = document.getElementById('p-title').value;
  state.personal.tagline   = document.getElementById('p-tagline').value;
  state.personal.email     = document.getElementById('p-email').value;
  state.personal.location  = document.getElementById('p-location').value;
  state.personal.linkedin  = document.getElementById('p-linkedin').value;
  state.personal.github    = document.getElementById('p-github').value;
  state.personal.instagram = document.getElementById('p-instagram').value;
}

// ─────────────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────────────

function renderSkills() {
  const s = state.skills || {};
  const languagesInput = document.getElementById('skills-languages');
  const frameworksInput = document.getElementById('skills-frameworks');
  const softInput = document.getElementById('skills-soft');

  if (languagesInput) languagesInput.value = Array.isArray(s.languages) ? s.languages.join(', ') : (s.languages || '');
  if (frameworksInput) frameworksInput.value = Array.isArray(s.frameworks) ? s.frameworks.join(', ') : (s.frameworks || '');
  if (softInput) softInput.value = Array.isArray(s.softSkills) ? s.softSkills.join(', ') : (s.softSkills || '');
}

function updateSkillsState() {
  if (!state.skills) state.skills = {};
  
  const languagesVal = document.getElementById('skills-languages')?.value || '';
  const frameworksVal = document.getElementById('skills-frameworks')?.value || '';
  const softVal = document.getElementById('skills-soft')?.value || '';

  state.skills.languages = languagesVal.split(',').map(item => item.trim()).filter(Boolean);
  state.skills.frameworks = frameworksVal.split(',').map(item => item.trim()).filter(Boolean);
  state.skills.softSkills = softVal.split(',').map(item => item.trim()).filter(Boolean);
}

// ─────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────

function renderProjects() {
  const list = document.getElementById('projects-list');
  list.innerHTML = (state.projects || []).map((proj, idx) => `
    <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
      <div class="flex items-center justify-between">
        <span class="font-bold text-sm text-sky-deep">Proyek #${idx + 1} — ${escHtml(proj.title || '')}</span>
        <button onclick="removeProject(${idx})" class="text-xs font-semibold text-red-600 hover:underline">🗑 Hapus</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input type="text" value="${escHtml(proj.title || '')}"
          onchange="state.projects[${idx}].title = this.value"
          placeholder="Judul Proyek" class="${inputCls}">
        <input type="text" value="${escHtml(proj.subtitle || '')}"
          onchange="state.projects[${idx}].subtitle = this.value"
          placeholder="Subtitle" class="${inputCls}">
        <input type="text" value="${escHtml(proj.period || '')}"
          onchange="state.projects[${idx}].period = this.value"
          placeholder="Periode (e.g. 2026)" class="${inputCls}">
        <input type="text" value="${escHtml((proj.stack || []).join(', '))}"
          onchange="state.projects[${idx}].stack = this.value.split(',').map(s=>s.trim())"
          placeholder="Tech Stack (pisah koma)" class="${inputCls}">
        <div class="md:col-span-2 flex items-center gap-2">
          <input type="text" id="proj-img-${idx}" value="${escHtml(proj.image || '')}"
            onchange="state.projects[${idx}].image = this.value"
            placeholder="URL Gambar Preview" class="${inputCls} flex-1">
          <input type="file" id="file-proj-${idx}" class="hidden" accept="image/*"
            onchange="handleImageUpload(this, 'proj-img-${idx}', ${idx})">
          <button type="button" onclick="document.getElementById('file-proj-${idx}').click()"
            class="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-xs font-semibold rounded-lg whitespace-nowrap">
            📷 Upload
          </button>
        </div>
        <textarea onchange="state.projects[${idx}].description = this.value"
          placeholder="Deskripsi Proyek"
          class="md:col-span-2 ${inputCls}" rows="2">${escHtml(proj.description || '')}</textarea>
        <input type="text" value="${escHtml(proj.impact || '')}"
          onchange="state.projects[${idx}].impact = this.value"
          placeholder="Impact / Hasil (highlight)" class="md:col-span-2 ${inputCls}">
      </div>
    </div>
  `).join('');
}

window.removeProject = (idx) => {
  if (!confirm(`Hapus proyek "${state.projects[idx]?.title}"?`)) return;
  state.projects.splice(idx, 1);
  renderProjects();
};

document.getElementById('add-project-btn').addEventListener('click', () => {
  if (!state.projects) state.projects = [];
  state.projects.push({ title: 'Proyek Baru', subtitle: '', period: '', stack: [], description: '', impact: '', image: '' });
  renderProjects();
  // Scroll to new item
  const list = document.getElementById('projects-list');
  list.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ─────────────────────────────────────────────────────────────
// EXPERIENCES
// ─────────────────────────────────────────────────────────────

function renderExperiences() {
  const list = document.getElementById('exp-list');
  list.innerHTML = (state.experiences || []).map((exp, idx) => `
    <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
      <div class="flex items-center justify-between">
        <span class="font-bold text-sm text-sky-deep">Pengalaman #${idx + 1} — ${escHtml(exp.role || '')}</span>
        <button onclick="removeExp(${idx})" class="text-xs font-semibold text-red-600 hover:underline">🗑 Hapus</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input type="text" value="${escHtml(exp.role || '')}"
          onchange="state.experiences[${idx}].role = this.value"
          placeholder="Posisi / Role" class="${inputCls}">
        <input type="text" value="${escHtml(exp.company || '')}"
          onchange="state.experiences[${idx}].company = this.value"
          placeholder="Perusahaan / Institusi" class="${inputCls}">
        <input type="text" value="${escHtml(exp.period || '')}"
          onchange="state.experiences[${idx}].period = this.value"
          placeholder="Periode (e.g. Jan 2025 — Sekarang)" class="${inputCls}">
        <input type="text" value="${escHtml(exp.type || '')}"
          onchange="state.experiences[${idx}].type = this.value"
          placeholder="Tipe (Kerja / Magang / Mengajar)" class="${inputCls}">
        <textarea onchange="state.experiences[${idx}].description = this.value"
          placeholder="Deskripsi Tugas"
          class="md:col-span-2 ${inputCls}" rows="2">${escHtml(exp.description || '')}</textarea>
      </div>
    </div>
  `).join('');
}

window.removeExp = (idx) => {
  if (!confirm(`Hapus pengalaman "${state.experiences[idx]?.role}"?`)) return;
  state.experiences.splice(idx, 1);
  renderExperiences();
};

document.getElementById('add-exp-btn').addEventListener('click', () => {
  if (!state.experiences) state.experiences = [];
  state.experiences.push({ role: 'Posisi Baru', company: '', period: '', type: 'Kerja', description: '' });
  renderExperiences();
});

// ─────────────────────────────────────────────────────────────
// ORGANIZATIONS
// ─────────────────────────────────────────────────────────────

function renderOrganizations() {
  const list = document.getElementById('org-list');
  list.innerHTML = (state.organizations || []).map((org, idx) => `
    <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
      <div class="flex items-center justify-between">
        <span class="font-bold text-sm text-sky-deep">Organisasi #${idx + 1} — ${escHtml(org.role || '')}</span>
        <button onclick="removeOrg(${idx})" class="text-xs font-semibold text-red-600 hover:underline">🗑 Hapus</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input type="text" value="${escHtml(org.role || '')}"
          onchange="state.organizations[${idx}].role = this.value"
          placeholder="Jabatan" class="${inputCls}">
        <input type="text" value="${escHtml(org.organization || '')}"
          onchange="state.organizations[${idx}].organization = this.value"
          placeholder="Nama Organisasi" class="${inputCls}">
        <input type="text" value="${escHtml(org.period || '')}"
          onchange="state.organizations[${idx}].period = this.value"
          placeholder="Periode" class="${inputCls} md:col-span-2">
        <textarea onchange="state.organizations[${idx}].description = this.value"
          placeholder="Deskripsi Kegiatan"
          class="md:col-span-2 ${inputCls}" rows="2">${escHtml(org.description || '')}</textarea>
      </div>
    </div>
  `).join('');
}

window.removeOrg = (idx) => {
  if (!confirm(`Hapus organisasi "${state.organizations[idx]?.role}"?`)) return;
  state.organizations.splice(idx, 1);
  renderOrganizations();
};

document.getElementById('add-org-btn').addEventListener('click', () => {
  if (!state.organizations) state.organizations = [];
  state.organizations.push({ role: 'Jabatan Baru', organization: '', period: '', description: '' });
  renderOrganizations();
});

// ─────────────────────────────────────────────────────────────
// CERTIFICATIONS
// ─────────────────────────────────────────────────────────────

function renderCertifications() {
  const list = document.getElementById('cert-list');
  list.innerHTML = (state.certifications || []).map((cert, idx) => `
    <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
      <div class="flex items-center justify-between">
        <span class="font-bold text-sm text-sky-deep">Sertifikasi #${idx + 1} — ${escHtml(cert.title || '')}</span>
        <button onclick="removeCert(${idx})" class="text-xs font-semibold text-red-600 hover:underline">🗑 Hapus</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input type="text" value="${escHtml(cert.title || '')}"
          onchange="state.certifications[${idx}].title = this.value"
          placeholder="Judul Sertifikasi" class="${inputCls}">
        <input type="text" value="${escHtml(cert.issuer || '')}"
          onchange="state.certifications[${idx}].issuer = this.value"
          placeholder="Penyelenggara / Issuer" class="${inputCls}">
        <input type="text" value="${escHtml(cert.year || '')}"
          onchange="state.certifications[${idx}].year = this.value"
          placeholder="Tahun" class="${inputCls}">
        <textarea onchange="state.certifications[${idx}].description = this.value"
          placeholder="Keterangan Tambahan"
          class="md:col-span-2 ${inputCls}" rows="2">${escHtml(cert.description || '')}</textarea>
      </div>
    </div>
  `).join('');
}

window.removeCert = (idx) => {
  if (!confirm(`Hapus sertifikasi "${state.certifications[idx]?.title}"?`)) return;
  state.certifications.splice(idx, 1);
  renderCertifications();
};

document.getElementById('add-cert-btn').addEventListener('click', () => {
  if (!state.certifications) state.certifications = [];
  state.certifications.push({ title: 'Sertifikasi Baru', issuer: '', year: '', description: '' });
  renderCertifications();
});

// ─────────────────────────────────────────────────────────────
// IMAGE UPLOAD directly to GitHub Repository
// ─────────────────────────────────────────────────────────────

window.handleImageUpload = async (fileInput, targetInputId, projectIdx) => {
  if (!fileInput.files?.[0]) return;

  const token = getToken();
  if (!token) {
    showToast('❌ Sesi login berakhir. Silakan login ulang.', false);
    showLoginScreen();
    return;
  }

  const btn = fileInput.nextElementSibling;
  const originalText = btn.textContent;
  btn.textContent = '⏳ Uploading...';
  btn.disabled    = true;

  try {
    showToast('⬆️ Mengupload gambar ke GitHub Repository...', true);
    const url = await uploadImage(fileInput.files[0], token);

    // Update input field dan state
    document.getElementById(targetInputId).value = url;
    if (state.projects[projectIdx]) state.projects[projectIdx].image = url;

    showToast('✅ Gambar berhasil diupload ke GitHub!');
  } catch (err) {
    showToast('❌ Gagal upload: ' + err.message, false);
  } finally {
    btn.textContent = originalText;
    btn.disabled    = false;
    fileInput.value = ''; // Reset file input
  }
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

// Escape HTML to prevent XSS in template literals
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Shared Tailwind input class string
const inputCls = 'px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-full focus:border-sky-bright outline-none transition focus:ring-1 focus:ring-sky-bright/30';

// Expose state + render functions globally (used by onchange handlers in innerHTML)
window.state         = state;
window.renderProjects      = renderProjects;
window.renderExperiences   = renderExperiences;
window.renderOrganizations = renderOrganizations;
window.renderCertifications = renderCertifications;

// Sync window.state reference after load
function syncGlobalState() {
  window.state = state;
}

// Override loadContent to sync global state after load
const _origLoadContent = loadContent;

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────

checkAuth();
