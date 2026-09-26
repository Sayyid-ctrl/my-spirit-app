// Configuration file for Google Apps Script Web App API
const CONFIG = {
  // Masukkan URL Google Apps Script Web App Anda setelah melakukan deployment
  API_URL: "MASUKKAN_URL_GOOGLE_APPS_SCRIPT"
};

// Implementasi Fetch API dengan Fallback ke LocalStorage (Offline Safe)
const API = {
  async fetchMotivasi() {
    if (!CONFIG.API_URL || CONFIG.API_URL === "MASUKKAN_URL_GOOGLE_APPS_SCRIPT") {
      console.warn("API_URL belum dikonfigurasi, menggunakan data fallback.");
      return null;
    }
    try {
      const res = await fetch(`${CONFIG.API_URL}?action=getMotivasi`);
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.error("Gagal mengambil data motivasi dari API:", err);
      return null;
    }
  },

  async fetchKategori() {
    if (!CONFIG.API_URL || CONFIG.API_URL === "MASUKKAN_URL_GOOGLE_APPS_SCRIPT") {
      return null;
    }
    try {
      const res = await fetch(`${CONFIG.API_URL}?action=getKategori`);
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.error("Gagal mengambil data kategori dari API:", err);
      return null;
    }
  },

  async fetchTarget(idUser = "default_user") {
    if (!CONFIG.API_URL || CONFIG.API_URL === "MASUKKAN_URL_GOOGLE_APPS_SCRIPT") {
      return null;
    }
    try {
      const res = await fetch(`${CONFIG.API_URL}?action=getTarget&id_user=${idUser}`);
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.error("Gagal mengambil data target dari API:", err);
      return null;
    }
  },

  async saveTarget(targetData) {
    if (!CONFIG.API_URL || CONFIG.API_URL === "MASUKKAN_URL_GOOGLE_APPS_SCRIPT") {
      return null;
    }
    try {
      const res = await fetch(CONFIG.API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "saveTarget", payload: targetData })
      });
      return await res.json();
    } catch (err) {
      console.error("Gagal menyimpan target ke API:", err);
      return null;
    }
  },

  async deleteTarget(idTarget) {
    if (!CONFIG.API_URL || CONFIG.API_URL === "MASUKKAN_URL_GOOGLE_APPS_SCRIPT") {
      return null;
    }
    try {
      const res = await fetch(CONFIG.API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "deleteTarget", id_target: idTarget })
      });
      return await res.json();
    } catch (err) {
      console.error("Gagal menghapus target dari API:", err);
      return null;
    }
  },

  async saveMotivasi(motivasiData) {
    if (!CONFIG.API_URL || CONFIG.API_URL === "MASUKKAN_URL_GOOGLE_APPS_SCRIPT") {
      return null;
    }
    try {
      const res = await fetch(CONFIG.API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "saveMotivasi", payload: motivasiData })
      });
      return await res.json();
    } catch (err) {
      console.error("Gagal menyimpan motivasi ke API:", err);
      return null;
    }
  }
};
