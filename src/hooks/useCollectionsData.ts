import { useState } from 'react';
import { CollectionManager, UserCollections } from '../collections/CollectionManager';

/**
 * Hook for managing persistent collection data (CRUD operations).
 */
export function useCollectionsData() {
  const [collections, setCollections] = useState<UserCollections>(CollectionManager.getAllCollections());
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(() => {
    const allCollections = CollectionManager.getAllCollections();
    return Object.keys(allCollections)[0] || null;
  });

  function refresh() {
    setCollections(CollectionManager.getAllCollections());
  }

  function createCollection(name: string) {
    const newId = CollectionManager.createCollection(name);
    refresh();
    setActiveCollectionId(newId);
  }

  function deleteCollection(id: string) {
    CollectionManager.deleteCollection(id);
    refresh();
    if (activeCollectionId === id) {
      const remainingIds = Object.keys(CollectionManager.getAllCollections());
      setActiveCollectionId(remainingIds[0] || null);
    }
  }

  function addItemToCollection(collectionId: string, itemId: string) {
    CollectionManager.addItemToCollection(collectionId, itemId);
    refresh();
    setActiveCollectionId(collectionId);
  }

  function removeItemFromCollection(collectionId: string, itemId: string) {
    CollectionManager.removeItemFromCollection(collectionId, itemId);
    refresh();
  }

  return {
    collections,
    activeCollectionId,
    setActiveCollectionId,
    createCollection,
    deleteCollection,
    addItemToCollection,
    removeItemFromCollection,
  };
}
