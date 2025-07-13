import { useState, useMemo } from 'react';
import { CollectionManager, UserCollections } from './CollectionManager';

export function useCollectionsStore() {
  const [collections, setCollections] = useState<UserCollections>(CollectionManager.getAllCollections());
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  // --- NEW STATE FOR SIDEBAR ---
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(() => {
    const allCollections = CollectionManager.getAllCollections();
    return Object.keys(allCollections)[0] || null;
  });

  function refresh() {
    setCollections(CollectionManager.getAllCollections());
  }

  // --- NEW ACTIONS FOR SIDEBAR ---
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

  function openPanel(itemId: string) {
    setSelectedItem(itemId);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setSelectedItem(null);
  }

  const activeCollectionItems = useMemo(() => {
    return activeCollectionId ? collections[activeCollectionId]?.items || [] : [];
  }, [collections, activeCollectionId]);

  return {
    collections,
    selectedItem,
    panelOpen,
    activeCollectionId,
    activeCollectionItems,
    setActiveCollectionId,
    createCollection,
    deleteCollection,
    addItemToCollection,
    removeItemFromCollection,
    openPanel,
    closePanel,
  };
}
