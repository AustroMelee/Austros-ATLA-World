import { useState, useEffect, useCallback } from 'react';
import type { Collection } from '../types/domainTypes';

const STORAGE_KEY = 'austros-atla-collections';

export interface UseCollectionsReturn {
  collections: Collection[];
  getCollectionsForCard: (cardId: string) => Collection[];
  isCardInAnyCollection: (cardId: string) => boolean;
  createCollection: (name: string, initialCardId?: string) => void;
  addCardToCollection: (collectionId: string, cardId: string) => void;
  removeCardFromCollection: (collectionId: string, cardId: string) => void;
}

export function useCollections(): UseCollectionsReturn {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCollections(JSON.parse(raw));
    } catch (err) { console.error('Failed to load collections', err); }
  }, []);

  const persist = useCallback((cols: Collection[]) => {
    setCollections(cols);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cols));
    } catch (err) { console.error('Failed to save collections', err); }
  }, []);

  const createCollection = useCallback((name: string, initialCardId?: string) => {
    const trimmed = name.trim();
    if (!trimmed || collections.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) return;
    const newCol: Collection = {
      id: `c${Date.now().toString(36)}`,
      name: trimmed,
      createdAt: new Date().toISOString(),
      cardIds: initialCardId ? [initialCardId] : [],
    };
    persist([...collections, newCol]);
  }, [collections, persist]);

  const addCardToCollection = useCallback((collectionId: string, cardId: string) => {
    const updated = collections.map(c => 
      c.id === collectionId && !c.cardIds.includes(cardId) 
        ? { ...c, cardIds: [...c.cardIds, cardId] } 
        : c
    );
    persist(updated);
  }, [collections, persist]);

  const removeCardFromCollection = useCallback((collectionId: string, cardId: string) => {
    const updated = collections.map(c => 
      c.id === collectionId 
        ? { ...c, cardIds: c.cardIds.filter(cid => cid !== cardId) } 
        : c
    );
    persist(updated);
  }, [collections, persist]);
  
  const getCollectionsForCard = useCallback((cardId: string) => 
    collections.filter(c => c.cardIds.includes(cardId)), [collections]);

  const isCardInAnyCollection = useCallback((cardId: string) => 
    collections.some(c => c.cardIds.includes(cardId)), [collections]);

  return { collections, createCollection, addCardToCollection, removeCardFromCollection, getCollectionsForCard, isCardInAnyCollection };
} 