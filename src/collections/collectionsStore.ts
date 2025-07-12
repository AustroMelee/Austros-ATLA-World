import { useState } from 'react';
import { CollectionManager, UserCollections } from './CollectionManager';

export function useCollectionsStore() {
  const [collections, setCollections] = useState<UserCollections>(CollectionManager.getAllCollections());
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  function refresh() {
    setCollections(CollectionManager.getAllCollections());
  }

  function createCollection(name: string) {
    CollectionManager.createCollection(name);
    refresh();
  }

  function addItemToCollection(collectionId: string, itemId: string) {
    CollectionManager.addItemToCollection(collectionId, itemId);
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

  return {
    collections,
    selectedItem,
    panelOpen,
    createCollection,
    addItemToCollection,
    openPanel,
    closePanel,
  };
}
