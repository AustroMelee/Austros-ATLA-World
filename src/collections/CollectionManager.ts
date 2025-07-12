export interface UserCollections {
  [collectionId: string]: {
    name: string;
    items: string[];
  };
}

const STORAGE_KEY = 'userCollections';

function loadCollections(): UserCollections {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UserCollections;
  } catch (e) {
    console.error('Failed to load collections:', e);
    return {};
  }
}

function saveCollections(collections: UserCollections) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  } catch (e) {
    console.error('Failed to save collections:', e);
  }
}

export const CollectionManager = {
  getAllCollections(): UserCollections {
    return loadCollections();
  },
  createCollection(name: string): string {
    const collections = loadCollections();
    const id = `col_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    collections[id] = { name, items: [] };
    saveCollections(collections);
    return id;
  },
  deleteCollection(id: string) {
    const collections = loadCollections();
    delete collections[id];
    saveCollections(collections);
  },
  addItemToCollection(collectionId: string, itemId: string) {
    const collections = loadCollections();
    if (collections[collectionId] && !collections[collectionId].items.includes(itemId)) {
      collections[collectionId].items.push(itemId);
      saveCollections(collections);
    }
  },
  removeItemFromCollection(collectionId: string, itemId: string) {
    const collections = loadCollections();
    if (collections[collectionId]) {
      collections[collectionId].items = collections[collectionId].items.filter(id => id !== itemId);
      saveCollections(collections);
    }
  },
};
