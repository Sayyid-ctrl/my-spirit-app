// Data Motivasi State
let motivasiListState = [
  {
    id_motivasi: "M01",
    judul: "Keutamaan Menuntut Ilmu",
    isi_motivasi: "Barangsiapa yang menempuh jalan untuk menuntut ilmu, Allah akan mudahkan baginya jalan menuju surga.",
    kategori: "Keutamaan Ilmu",
    sumber: "HR. Muslim",
    status: "Aktif"
  },
  {
    id_motivasi: "M02",
    judul: "Semangat Hafalan Santri",
    isi_motivasi: "Penghafal Al-Qur'an adalah keluarga Allah di bumi. Jangan lelah mengulang muraja'ahmu setiap hari.",
    kategori: "Santri",
    sumber: "Nasihat Kiai",
    status: "Aktif"
  },
  {
    id_motivasi: "M03",
    judul: "Istiqomah dalam Kebaikan",
    isi_motivasi: "Amalan yang paling dicintai Allah adalah amalan yang kontinyu (rutin) meskipun sedikit.",
    kategori: "Ibadah",
    sumber: "HR. Bukhari & Muslim",
    status: "Aktif"
  },
  {
    id_motivasi: "M04",
    judul: "Waktu Adalah Pedang",
    isi_motivasi: "Waktu bagaikan pedang. Jika engkau tidak memotongnya dengan kegiatan bermanfaat, ia akan memotongmu.",
    kategori: "Umum",
    sumber: "Mahfuzhat",
    status: "Aktif"
  }
];

const CATEGORIES = ["Semua", "Keutamaan Ilmu", "Santri", "Ibadah", "Umum"];
let activeCategory = "Semua";

// App Initialization
document.addEventListener("DOMContentLoaded", async () => {
  initDarkMode();
  initInitialTargets();
  renderCategoryPills();
  
  // Try loading live data from API
  await loadMotivasiData();
  await loadTargetData();

  renderMotivasiList();
  renderTargets();
  updateProgressVisuals();
});

// Dark Mode Functions
function initDarkMode() {
  const isDark = Storage.getDarkMode();
  if (isDark) {
    document.body.classList.add("dark-mode");
  }
  updateDarkModeIcon(isDark);
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  Storage.setDarkMode(isDark);
  updateDarkModeIcon(isDark);
}

function updateDarkModeIcon(isDark) {
  const btn = document.getElementById("theme-icon-btn");
  if (!btn) return;
  if (isDark) {
    // Sun icon for switching to light mode
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  } else {
    // Moon icon for switching to dark mode
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  }
}

// Load Live Data Motivasi from API
async function loadMotivasiData() {
  const apiData = await API.fetchMotivasi();
  if (apiData && Array.isArray(apiData) && apiData.length > 0) {
    motivasiListState = apiData;
    const daily = apiData[0];
    const quoteEl = document.getElementById("daily-quote");
    const authorEl = document.getElementById("daily-author");
    if (quoteEl && daily.isi_motivasi) quoteEl.innerText = `"${daily.isi_motivasi}"`;
    if (authorEl && daily.sumber) authorEl.innerText = daily.sumber;
  }
}

// Load Live Data Target from API
async function loadTargetData() {
  const apiTargets = await API.fetchTarget();
  if (apiTargets && Array.isArray(apiTargets)) {
    Storage.saveTargets(apiTargets);
  }
}

// Switch Navigation View
function switchView(viewName) {
  document.querySelectorAll(".view").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));

  const targetView = document.getElementById(`view-${viewName}`);
  const targetNav = document.getElementById(`nav-${viewName}`);

  if (targetView) targetView.classList.add("active");
  if (targetNav) targetNav.classList.add("active");
}

// Initial Target setup if empty
function initInitialTargets() {
  const current = Storage.getTargets();
  if (!current || current.length === 0) {
    const defaultTargets = [
      { id_target: "T1", judul_target: "Setoran Ziyadah 1 Halaman", status: "Selesai", tanggal: new Date().toISOString() },
      { id_target: "T2", judul_target: "Muroja'ah Jus 30", status: "Belum", tanggal: new Date().toISOString() },
      { id_target: "T3", judul_target: "Membaca Kitab Adabul 'Alim", status: "Belum", tanggal: new Date().toISOString() }
    ];
    Storage.saveTargets(defaultTargets);
  }
}

// Category Pills Renderer
function renderCategoryPills() {
  const container = document.getElementById("category-pills");
  if (!container) return;
  
  container.innerHTML = CATEGORIES.map(cat => `
    <button class="pill ${cat === activeCategory ? 'active' : ''}" onclick="selectCategory('${cat}')">
      ${cat}
    </button>
  `).join("");
}

function selectCategory(category) {
  activeCategory = category;
  renderCategoryPills();
  renderMotivasiList();
}

// Motivasi List Renderer
function renderMotivasiList() {
  const container = document.getElementById("motivasi-list");
  if (!container) return;

  const searchQuery = (document.getElementById("search-motivasi")?.value || "").toLowerCase();
  const favorites = Storage.getFavorites();

  const filtered = motivasiListState.filter(item => {
    const matchCat = activeCategory === "Semua" || item.kategori === activeCategory;
    const matchSearch = (item.judul || "").toLowerCase().includes(searchQuery) || (item.isi_motivasi || "").toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="card" style="text-align: center; color: var(--text-muted);">Tidak ada motivasi yang ditemukan.</div>`;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isFav = favorites.includes(item.id_motivasi);
    return `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <span class="pill" style="font-size: 0.7rem; padding: 2px 8px; background: var(--primary-light); color: var(--primary-dark); border: none;">${item.kategori || 'Umum'}</span>
          <button onclick="handleToggleFav('${item.id_motivasi}')" style="background: none; border: none; cursor: pointer; color: ${isFav ? 'var(--accent)' : 'var(--border)'}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
        <h4 style="font-size: 0.95rem; margin-bottom: 6px; color: var(--text-main);">${item.judul}</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; margin-bottom: 8px;">"${item.isi_motivasi}"</p>
        <p style="font-size: 0.75rem; font-weight: 700; color: var(--primary); text-align: right;">— ${item.sumber || '-'}</p>
      </div>
    `;
  }).join("");
}

function handleToggleFav(id) {
  Storage.toggleFavorite(id);
  renderMotivasiList();
}

// Target Belajar Management
function renderTargets() {
  const container = document.getElementById("target-list");
  if (!container) return;

  const targets = Storage.getTargets();

  if (targets.length === 0) {
    container.innerHTML = `<div class="card" style="text-align: center; color: var(--text-muted);">Belum ada target. Klik tombol di atas untuk menambah.</div>`;
    return;
  }

  container.innerHTML = targets.map(t => {
    const isDone = t.status === "Selesai";
    return `
      <div class="target-item ${isDone ? 'completed' : ''}">
        <div class="target-left" onclick="toggleTargetStatus('${t.id_target}')">
          <div class="checkbox-custom">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span class="target-title">${t.judul_target}</span>
        </div>
        <div class="target-actions">
          <button class="btn btn-sm btn-outline" onclick="openEditTargetModal('${t.id_target}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteTarget('${t.id_target}')">&times;</button>
        </div>
      </div>
    `;
  }).join("");

  updateProgressVisuals();
}

async function toggleTargetStatus(idTarget) {
  const targets = Storage.getTargets();
  const index = targets.findIndex(t => t.id_target === idTarget);
  if (index > -1) {
    const newStatus = targets[index].status === "Selesai" ? "Belum" : "Selesai";
    targets[index].status = newStatus;
    Storage.saveTargets(targets);
    renderTargets();

    // Async sync to API
    await API.saveTarget(targets[index]);
  }
}

function updateProgressVisuals() {
  const targets = Storage.getTargets();
  const total = targets.length;
  const completed = targets.filter(t => t.status === "Selesai").length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Home progress update
  const homeCircle = document.getElementById("home-progress-circle");
  const homeText = document.getElementById("home-progress-text");
  const homeDetail = document.getElementById("home-progress-detail");
  if (homeCircle) homeCircle.style.setProperty("--percent", percent);
  if (homeText) homeText.innerText = `${percent}%`;
  if (homeDetail) homeDetail.innerText = `${completed} dari ${total} target selesai`;

  // Target view progress update
  const targetCircle = document.getElementById("target-progress-circle");
  const targetText = document.getElementById("target-progress-text");
  const targetDetail = document.getElementById("target-progress-detail");
  if (targetCircle) targetCircle.style.setProperty("--percent", percent);
  if (targetText) targetText.innerText = `${percent}%`;
  if (targetDetail) {
    targetDetail.innerText = percent === 100 ? "Alhamdulillah! Semua target tercapai." : `${completed} dari ${total} target terselesaikan.`;
  }
}

// Modal Handlers
function openAddTargetModal() {
  document.getElementById("modal-target-title").innerText = "Tambah Target Belajar";
  document.getElementById("target-id").value = "";
  document.getElementById("target-input-judul").value = "";
  document.getElementById("modal-target").classList.add("active");
}

function openEditTargetModal(idTarget) {
  const targets = Storage.getTargets();
  const item = targets.find(t => t.id_target === idTarget);
  if (!item) return;

  document.getElementById("modal-target-title").innerText = "Edit Target Belajar";
  document.getElementById("target-id").value = item.id_target;
  document.getElementById("target-input-judul").value = item.judul_target;
  document.getElementById("modal-target").classList.add("active");
}

function closeTargetModal() {
  document.getElementById("modal-target").classList.remove("active");
}

async function handleSaveTarget(event) {
  event.preventDefault();
  const idTarget = document.getElementById("target-id").value;
  const judul = document.getElementById("target-input-judul").value.trim();
  if (!judul) return;

  let targets = Storage.getTargets();
  let targetObj = null;

  if (idTarget) {
    // Edit existing
    const idx = targets.findIndex(t => t.id_target === idTarget);
    if (idx > -1) {
      targets[idx].judul_target = judul;
      targetObj = targets[idx];
    }
  } else {
    // Add new
    targetObj = {
      id_target: "",
      judul_target: judul,
      status: "Belum",
      tanggal: new Date().toISOString()
    };
    targets.push(targetObj);
  }

  Storage.saveTargets(targets);
  closeTargetModal();
  renderTargets();

  if (targetObj) {
    await API.saveTarget(targetObj);
    await loadTargetData();
    renderTargets();
  }
}

async function deleteTarget(idTarget) {
  let targets = Storage.getTargets();
  targets = targets.filter(t => t.id_target !== idTarget);
  Storage.saveTargets(targets);
  renderTargets();

  await API.deleteTarget(idTarget);
}

// Admin Logic
function handleAdminLogin(e) {
  e.preventDefault();
  document.getElementById("admin-login-card").style.display = "none";
  document.getElementById("admin-panel").style.display = "block";
}

function handleAdminLogout() {
  document.getElementById("admin-login-card").style.display = "block";
  document.getElementById("admin-panel").style.display = "none";
}

async function handleAddMotivasi(e) {
  e.preventDefault();
  const judul = document.getElementById("admin-motivasi-judul").value;
  const isi = document.getElementById("admin-motivasi-isi").value;
  const kategori = document.getElementById("admin-motivasi-kategori").value;
  const sumber = document.getElementById("admin-motivasi-sumber").value;

  const newMotivasi = {
    judul,
    isi_motivasi: isi,
    kategori,
    sumber,
    status: "Aktif"
  };

  motivasiListState.unshift(newMotivasi);
  renderMotivasiList();

  const res = await API.saveMotivasi(newMotivasi);
  if (res && res.success) {
    alert("Motivasi berhasil tersimpan ke Google Spreadsheet!");
  } else {
    alert("Motivasi tersimpan di UI lokal.");
  }
  
  e.target.reset();
  await loadMotivasiData();
  renderMotivasiList();
}
