<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Byron Portfolio — Admin CMS</title>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: { sans: ['Quicksand', 'sans-serif'] },
            colors: {
              sky: { deep: '#1565C0', bright: '#42A5F5', horizon: '#90CAF9', cloud: '#F0F7FF', gold: '#FFB74D', navy: '#0D1B2A' }
            }
          }
        }
      }
    </script>
    <style>
      body { font-family: 'Quicksand', sans-serif; background-color: #F0F7FF; color: #0D1B2A; }
    </style>
</head>
<body class="min-h-screen antialiased flex flex-col">

    <!-- LOGIN MODAL / SCREEN -->
    <div id="login-screen" class="fixed inset-0 z-50 flex items-center justify-center bg-sky-navy/70 backdrop-blur-md p-4">
        <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-sky-bright/30">
            <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-bright/10 text-sky-deep mb-3">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h1 class="text-2xl font-bold text-sky-navy">Byron Admin CMS</h1>
                <p class="text-sm text-gray-500 mt-1">Masuk untuk mengelola data portofolio</p>
            </div>

            <div id="login-alert" class="hidden mb-4 p-3 rounded-lg text-sm bg-red-100 text-red-700"></div>

            <form id="login-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                    <input type="text" id="username" class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-sky-bright focus:ring-2 focus:ring-sky-bright/20 outline-none transition" placeholder="borpabloo" required>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                    <input type="password" id="password" class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-sky-bright focus:ring-2 focus:ring-sky-bright/20 outline-none transition" placeholder="••••" required>
                </div>
                <button type="submit" class="w-full py-3 bg-sky-deep hover:bg-sky-bright text-white font-bold rounded-xl shadow-lg transition duration-200">
                    Masuk Dashboard →
                </button>
            </form>
            <div class="text-center mt-4 space-y-1">
                <a href="../" class="block text-xs text-sky-deep hover:underline">← Kembali ke Website Utama</a>
            </div>
        </div>
    </div>

    <!-- MAIN ADMIN INTERFACE -->
    <div id="admin-app" class="hidden flex-1 flex flex-col">
        <!-- Top Navbar -->
        <header class="bg-white border-b border-sky-bright/20 shadow-sm sticky top-0 z-30">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span class="font-bold text-xl text-sky-deep">Byron CMS</span>
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Live Server</span>
                </div>
                <div class="flex items-center gap-3">
                    <button id="save-all-btn" class="px-5 py-2 bg-sky-deep hover:bg-sky-bright text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                        Simpan Perubahan
                    </button>
                    <a href="../" target="_blank" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition">
                        Pratinjau Web ↗
                    </a>
                    <button id="logout-btn" class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl text-sm transition">
                        Keluar
                    </button>
                </div>
            </div>
        </header>

        <!-- Status Toast -->
        <div id="toast" class="fixed bottom-6 right-6 z-40 hidden px-6 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all transform duration-300"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Sidebar Nav Tabs -->
            <nav class="space-y-2">
                <button data-tab="personal" class="nav-tab active w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold text-sm transition bg-sky-deep text-white shadow-md">
                    <span>👤</span> Bio & Data Diri
                </button>
                <button data-tab="projects" class="nav-tab w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold text-sm transition text-gray-700 hover:bg-white">
                    <span>💻</span> Proyek Portfolio
                </button>
                <button data-tab="experiences" class="nav-tab w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold text-sm transition text-gray-700 hover:bg-white">
                    <span>💼</span> Pengalaman Kerja
                </button>
                <button data-tab="organizations" class="nav-tab w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold text-sm transition text-gray-700 hover:bg-white">
                    <span>🏛️</span> Pengalaman Organisasi
                </button>
                <button data-tab="certifications" class="nav-tab w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold text-sm transition text-gray-700 hover:bg-white">
                    <span>🏆</span> Sertifikasi & Pelatihan
                </button>
            </nav>

            <!-- Main Content Area -->
            <main class="lg:col-span-3">
                
                <!-- TAB 1: PERSONAL BIO -->
                <div id="tab-personal" class="tab-content bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-sky-bright/20 space-y-6">
                    <h2 class="text-xl font-bold text-sky-navy border-b pb-3">Edit Bio & Informasi Kontak</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                            <input type="text" id="p-name" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-sky-bright outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Profesi / Title</label>
                            <input type="text" id="p-title" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-sky-bright outline-none">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Tagline Hero</label>
                            <input type="text" id="p-tagline" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-sky-bright outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input type="email" id="p-email" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-sky-bright outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Lokasi</label>
                            <input type="text" id="p-location" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-sky-bright outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">URL LinkedIn</label>
                            <input type="url" id="p-linkedin" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-sky-bright outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">URL GitHub</label>
                            <input type="url" id="p-github" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-sky-bright outline-none">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-semibold text-gray-700 mb-1">URL Instagram</label>
                            <input type="url" id="p-instagram" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-sky-bright outline-none">
                        </div>
                    </div>
                </div>

                <!-- TAB 2: PROJECTS -->
                <div id="tab-projects" class="tab-content hidden bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-sky-bright/20 space-y-6">
                    <div class="flex items-center justify-between border-b pb-3">
                        <h2 class="text-xl font-bold text-sky-navy">Kelola Proyek Portfolio</h2>
                        <button id="add-project-btn" class="px-4 py-2 bg-sky-deep hover:bg-sky-bright text-white text-xs font-bold rounded-xl transition">+ Tambah Proyek</button>
                    </div>
                    <div id="projects-list" class="space-y-4"></div>
                </div>

                <!-- TAB 3: EXPERIENCES -->
                <div id="tab-experiences" class="tab-content hidden bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-sky-bright/20 space-y-6">
                    <div class="flex items-center justify-between border-b pb-3">
                        <h2 class="text-xl font-bold text-sky-navy">Kelola Pengalaman Kerja</h2>
                        <button id="add-exp-btn" class="px-4 py-2 bg-sky-deep hover:bg-sky-bright text-white text-xs font-bold rounded-xl transition">+ Tambah Pengalaman</button>
                    </div>
                    <div id="exp-list" class="space-y-4"></div>
                </div>

                <!-- TAB 4: ORGANIZATIONS -->
                <div id="tab-organizations" class="tab-content hidden bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-sky-bright/20 space-y-6">
                    <div class="flex items-center justify-between border-b pb-3">
                        <h2 class="text-xl font-bold text-sky-navy">Kelola Pengalaman Organisasi</h2>
                        <button id="add-org-btn" class="px-4 py-2 bg-sky-deep hover:bg-sky-bright text-white text-xs font-bold rounded-xl transition">+ Tambah Organisasi</button>
                    </div>
                    <div id="org-list" class="space-y-4"></div>
                </div>

                <!-- TAB 5: CERTIFICATIONS -->
                <div id="tab-certifications" class="tab-content hidden bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-sky-bright/20 space-y-6">
                    <div class="flex items-center justify-between border-b pb-3">
                        <h2 class="text-xl font-bold text-sky-navy">Kelola Sertifikasi & Pelatihan</h2>
                        <button id="add-cert-btn" class="px-4 py-2 bg-sky-deep hover:bg-sky-bright text-white text-xs font-bold rounded-xl transition">+ Tambah Sertifikasi</button>
                    </div>
                    <div id="cert-list" class="space-y-4"></div>
                </div>

            </main>
        </div>
    </div>

    <!-- JS APP LOGIC -->
    <script>
      let state = null;

      function getApiUrl(action) {
        const path = window.location.pathname;
        if (path.endsWith('/admin')) {
          return 'admin/api.php?action=' + action;
        }
        return 'api.php?action=' + action;
      }

      const loginScreen = document.getElementById('login-screen');
      const adminApp = document.getElementById('admin-app');
      const loginForm = document.getElementById('login-form');
      const loginAlert = document.getElementById('login-alert');
      const toast = document.getElementById('toast');

      function showToast(msg, isSuccess = true) {
        toast.textContent = msg;
        toast.className = `fixed bottom-6 right-6 z-40 px-6 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all transform duration-300 ${isSuccess ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
      }

      async function checkAuth() {
        try {
          const res = await fetch(getApiUrl('check'));
          if (!res.ok) throw new Error('PHP backend not reachable');
          const data = await res.json();
          if (data.authenticated) {
            loginScreen.classList.add('hidden');
            adminApp.classList.remove('hidden');
            loadContent();
          } else {
            loginScreen.classList.remove('hidden');
            adminApp.classList.add('hidden');
          }
        } catch (err) {
          // If accessing via Vite dev server (port 5173 without PHP)
          if (window.location.port === '5173') {
            loginAlert.innerHTML = '⚠️ Node.js Vite server tidak menjalankan PHP.<br>Buka <b>http://localhost:8000/admin/</b> (via <code>php -S localhost:8000</code>) atau buka live site <b>https://byron.my.id/admin</b>.';
            loginAlert.classList.remove('hidden');
          }
        }
      }

      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginAlert.classList.add('hidden');
        try {
          const res = await fetch(getApiUrl('login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: document.getElementById('username').value,
              password: document.getElementById('password').value
            })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            checkAuth();
          } else {
            loginAlert.textContent = data.message || 'Login gagal';
            loginAlert.classList.remove('hidden');
          }
        } catch (err) {
          if (window.location.port === '5173') {
            loginAlert.innerHTML = '⚠️ Perintah PHP belum berjalan di port 5173.<br>Buka terminal lalu ketik: <code>cd dist; php -S localhost:8000</code><br>Lalu akses: <b>http://localhost:8000/admin/</b>';
          } else {
            loginAlert.textContent = 'Gagal terhubung ke api.php server';
          }
          loginAlert.classList.remove('hidden');
        }
      });

      document.getElementById('logout-btn').addEventListener('click', async () => {
        await fetch(getApiUrl('logout'));
        checkAuth();
      });

      // Tabs switcher
      document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.nav-tab').forEach(t => {
            t.classList.remove('bg-sky-deep', 'text-white', 'shadow-md');
            t.classList.add('text-gray-700');
          });
          tab.classList.add('bg-sky-deep', 'text-white', 'shadow-md');
          tab.classList.remove('text-gray-700');

          document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
          document.getElementById(`tab-${tab.dataset.tab}`).classList.remove('hidden');
        });
      });

      async function loadContent() {
        const res = await fetch(getApiUrl('get'));
        state = await res.json();
        renderAll();
      }

      function renderAll() {
        if (!state) return;

        // Personal
        document.getElementById('p-name').value = state.personal.name || '';
        document.getElementById('p-title').value = state.personal.title || '';
        document.getElementById('p-tagline').value = state.personal.tagline || '';
        document.getElementById('p-email').value = state.personal.email || '';
        document.getElementById('p-location').value = state.personal.location || '';
        document.getElementById('p-linkedin').value = state.personal.linkedin || '';
        document.getElementById('p-github').value = state.personal.github || '';
        document.getElementById('p-instagram').value = state.personal.instagram || '';

        // Projects
        renderProjects();
        // Experiences
        renderExperiences();
        // Organizations
        renderOrganizations();
        // Certifications
        renderCertifications();
      }

      function updatePersonalState() {
        state.personal.name = document.getElementById('p-name').value;
        state.personal.title = document.getElementById('p-title').value;
        state.personal.tagline = document.getElementById('p-tagline').value;
        state.personal.email = document.getElementById('p-email').value;
        state.personal.location = document.getElementById('p-location').value;
        state.personal.linkedin = document.getElementById('p-linkedin').value;
        state.personal.github = document.getElementById('p-github').value;
        state.personal.instagram = document.getElementById('p-instagram').value;
      }

      // Projects UI
      function renderProjects() {
        const list = document.getElementById('projects-list');
        list.innerHTML = state.projects.map((proj, idx) => `
          <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-sky-deep">Proyek #${idx + 1}</span>
              <button onclick="removeProject(${idx})" class="text-xs font-semibold text-red-600 hover:underline">Hapus</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" value="${proj.title || ''}" onchange="state.projects[${idx}].title = this.value" placeholder="Judul Proyek" class="px-3 py-1.5 border rounded-lg text-sm w-full">
              <input type="text" value="${proj.subtitle || ''}" onchange="state.projects[${idx}].subtitle = this.value" placeholder="Subtitle" class="px-3 py-1.5 border rounded-lg text-sm w-full">
              <input type="text" value="${proj.period || ''}" onchange="state.projects[${idx}].period = this.value" placeholder="Periode (e.g. 2026)" class="px-3 py-1.5 border rounded-lg text-sm w-full">
              <input type="text" value="${(proj.stack || []).join(', ')}" onchange="state.projects[${idx}].stack = this.value.split(',').map(s=>s.trim())" placeholder="Tech Stack (comma separated)" class="px-3 py-1.5 border rounded-lg text-sm w-full">
              <div class="md:col-span-2 flex items-center gap-2">
                <input type="text" id="proj-img-${idx}" value="${proj.image || ''}" onchange="state.projects[${idx}].image = this.value" placeholder="URL Gambar Preview" class="px-3 py-1.5 border rounded-lg text-sm flex-1">
                <input type="file" id="file-proj-${idx}" class="hidden" onchange="uploadImage(this, 'proj-img-${idx}', ${idx})">
                <button type="button" onclick="document.getElementById('file-proj-${idx}').click()" class="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-xs font-semibold rounded-lg">Upload Gambar</button>
              </div>
              <textarea onchange="state.projects[${idx}].description = this.value" placeholder="Deskripsi Proyek" class="md:col-span-2 px-3 py-1.5 border rounded-lg text-sm w-full" rows="2">${proj.description || ''}</textarea>
              <input type="text" value="${proj.impact || ''}" onchange="state.projects[${idx}].impact = this.value" placeholder="Impact / Hasil (Highlight)" class="md:col-span-2 px-3 py-1.5 border rounded-lg text-sm w-full">
            </div>
          </div>
        `).join('');
      }

      function removeProject(idx) {
        state.projects.splice(idx, 1);
        renderProjects();
      }

      document.getElementById('add-project-btn').addEventListener('click', () => {
        state.projects.push({ title: 'Proyek Baru', subtitle: '', period: '', stack: [], description: '', impact: '', image: '' });
        renderProjects();
      });

      // Experiences UI
      function renderExperiences() {
        const list = document.getElementById('exp-list');
        list.innerHTML = state.experiences.map((exp, idx) => `
          <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-sky-deep">Pengalaman #${idx + 1}</span>
              <button onclick="removeExp(${idx})" class="text-xs font-semibold text-red-600 hover:underline">Hapus</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" value="${exp.role || ''}" onchange="state.experiences[${idx}].role = this.value" placeholder="Posisi / Role" class="px-3 py-1.5 border rounded-lg text-sm w-full">
              <input type="text" value="${exp.company || ''}" onchange="state.experiences[${idx}].company = this.value" placeholder="Perusahaan / Kampus" class="px-3 py-1.5 border rounded-lg text-sm w-full">
              <input type="text" value="${exp.period || ''}" onchange="state.experiences[${idx}].period = this.value" placeholder="Periode" class="px-3 py-1.5 border rounded-lg text-sm w-full">
              <textarea onchange="state.experiences[${idx}].description = this.value" placeholder="Deskripsi Tugas" class="md:col-span-2 px-3 py-1.5 border rounded-lg text-sm w-full" rows="2">${exp.description || ''}</textarea>
            </div>
          </div>
        `).join('');
      }

      function removeExp(idx) {
        state.experiences.splice(idx, 1);
        renderExperiences();
      }

      document.getElementById('add-exp-btn').addEventListener('click', () => {
        state.experiences.push({ role: 'Posisi Baru', company: '', period: '', description: '' });
        renderExperiences();
      });

      // Organizations UI
      function renderOrganizations() {
        const list = document.getElementById('org-list');
        list.innerHTML = state.organizations.map((org, idx) => `
          <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-sky-deep">Organisasi #${idx + 1}</span>
              <button onclick="removeOrg(${idx})" class="text-xs font-semibold text-red-600 hover:underline">Hapus</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" value="${org.role || ''}" onchange="state.organizations[${idx}].role = this.value" placeholder="Jabatan" class="px-3 py-1.5 border rounded-lg text-sm w-full">
              <input type="text" value="${org.organization || ''}" onchange="state.organizations[${idx}].organization = this.value" placeholder="Nama Organisasi" class="px-3 py-1.5 border rounded-lg text-sm w-full">
              <input type="text" value="${org.period || ''}" onchange="state.organizations[${idx}].period = this.value" placeholder="Periode" class="px-3 py-1.5 border rounded-lg text-sm w-full">
              <textarea onchange="state.organizations[${idx}].description = this.value" placeholder="Deskripsi Kegiatan" class="md:col-span-2 px-3 py-1.5 border rounded-lg text-sm w-full" rows="2">${org.description || ''}</textarea>
            </div>
          </div>
        `).join('');
      }

      function removeOrg(idx) {
        state.organizations.splice(idx, 1);
        renderOrganizations();
      }

      document.getElementById('add-org-btn').addEventListener('click', () => {
        state.organizations.push({ role: 'Jabatan Baru', organization: '', period: '', description: '' });
        renderOrganizations();
      });

      // Certifications UI
      function renderCertifications() {
        const list = document.getElementById('cert-list');
        list.innerHTML = state.certifications.map((cert, idx) => `
          <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-sky-deep">Sertifikasi #${idx + 1}</span>
              <button onclick="removeCert(${idx})" class="text-xs font-semibold text-red-600 hover:underline">Hapus</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" value="${cert.title || ''}" onchange="state.certifications[${idx}].title = this.value" placeholder="Judul Sertifikasi / Pelatihan" class="px-3 py-1.5 border rounded-lg text-sm w-full">
              <input type="text" value="${cert.issuer || ''}" onchange="state.certifications[${idx}].issuer = this.value" placeholder="Penyelenggara / Issuer" class="px-3 py-1.5 border rounded-lg text-sm w-full">
              <input type="text" value="${cert.year || ''}" onchange="state.certifications[${idx}].year = this.value" placeholder="Tahun" class="px-3 py-1.5 border rounded-lg text-sm w-full">
              <textarea onchange="state.certifications[${idx}].description = this.value" placeholder="Keterangan Tambahan" class="md:col-span-2 px-3 py-1.5 border rounded-lg text-sm w-full" rows="2">${cert.description || ''}</textarea>
            </div>
          </div>
        `).join('');
      }

      function removeCert(idx) {
        state.certifications.splice(idx, 1);
        renderCertifications();
      }

      document.getElementById('add-cert-btn').addEventListener('click', () => {
        state.certifications.push({ title: 'Sertifikasi Baru', issuer: '', year: '', description: '' });
        renderCertifications();
      });

      // Image Uploader
      async function uploadImage(fileInput, targetInputId, projectIdx) {
        if (!fileInput.files || !fileInput.files[0]) return;
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        try {
          showToast('Mengunggah gambar...', true);
          const res = await fetch(getApiUrl('upload'), {
            method: 'POST',
            body: formData
          });
          const result = await res.json();
          if (res.ok && result.success) {
            document.getElementById(targetInputId).value = result.url;
            state.projects[projectIdx].image = result.url;
            showToast('Gambar berhasil diupload!');
          } else {
            showToast(result.message || 'Gagal mengunggah', false);
          }
        } catch (e) {
          showToast('Error koneksi upload', false);
        }
      }

      // Save all state to server
      document.getElementById('save-all-btn').addEventListener('click', async () => {
        updatePersonalState();
        showToast('Menyimpan perubahan...', true);
        try {
          const res = await fetch(getApiUrl('save'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state)
          });
          const result = await res.json();
          if (res.ok && result.success) {
            showToast('Perubahan berhasil disimpan!');
          } else {
            showToast(result.message || 'Gagal menyimpan', false);
          }
        } catch (e) {
          showToast('Terjadi kesalahan jaringan', false);
        }
      });

      // Init check
      checkAuth();
    </script>
</body>
</html>
