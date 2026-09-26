// Helper untuk mengelola data di LocalStorage
const STORAGE_KEYS = {
  TARGETS: "myspirit_targets",
  FAVORITES: "myspirit_favorites",
  USER: "myspirit_user"
};

const Storage = {
  getTargets() {
    const data = localStorage.getItem(STORAGE_KEYS.TARGETS);
    return data ? JSON.parse(data) : [];
  },

  saveTargets(targets) {
    localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(targets));
  },

  getFavorites() {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  },

  saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  },

  toggleFavorite(idMotivasi) {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(idMotivasi);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(idMotivasi);
    }
    this.saveFavorites(favorites);
    return favorites;
  }
};
