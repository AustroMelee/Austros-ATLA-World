/**
 * CollectionManager handles all localStorage logic for collections.
 * - create/delete collections
 * - add/remove cards from a collection
 * - retrieve all collections
 * - save/retrieve notes for collections
 */
export type Collection = {
  name: string;
  items: string[];
  notes?: string;
};

export type CollectionsMap = Record<string, Collection>;

const STORAGE_KEY = 'atlaCollections';

export const CollectionManager = {
  load(): CollectionsMap {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};
    try {
      return JSON.parse(saved);
    } catch {
      return {};
    }
  },
  save(collections: CollectionsMap) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  },
  create(collections: CollectionsMap, name: string): CollectionsMap {
    if (!name || collections[name]) return collections;
    return { ...collections, [name]: { name, items: [], notes: '' } };
  },
  addCard(collections: CollectionsMap, collectionName: string, cardId: string): CollectionsMap {
    if (!collections[collectionName] || collections[collectionName].items.includes(cardId)) return collections;
    return {
      ...collections,
      [collectionName]: {
        ...collections[collectionName],
        items: [...collections[collectionName].items, cardId],
      },
    };
  },
  removeCard(collections: CollectionsMap, collectionName: string, cardId: string): CollectionsMap {
    if (!collections[collectionName]) return collections;
    return {
      ...collections,
      [collectionName]: {
        ...collections[collectionName],
        items: collections[collectionName].items.filter(id => id !== cardId),
      },
    };
  },
  saveNote(collections: CollectionsMap, collectionName: string, note: string): CollectionsMap {
    if (!collections[collectionName]) return collections;
    return {
      ...collections,
      [collectionName]: {
        ...collections[collectionName],
        notes: note,
      },
    };
  },
  delete(collections: CollectionsMap, name: string): CollectionsMap {
    const { [name]: _, ...rest } = collections;
    return rest;
  },
};
