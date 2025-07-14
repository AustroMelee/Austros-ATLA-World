import { useState } from 'react';

/**
 * Hook for managing UI state related to the collections panel.
 */
export function useCollectionsUI() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  function openPanel(itemId: string) {
    setSelectedItem(itemId);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setSelectedItem(null);
  }

  return {
    panelOpen,
    selectedItem,
    setSelectedItem,
    openPanel,
    closePanel,
  };
}
