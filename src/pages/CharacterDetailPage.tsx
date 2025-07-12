import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import { getEntityBySlug, EnrichedRecord } from '../search/ClientSearchEngine';

const CharacterDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [character, setCharacter] = useState<EnrichedRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      const data = getEntityBySlug(slug || '');
      if (!data) {
        console.log('[CharacterDetailPage] No record found for slug:', slug);
      }
      setCharacter(data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (typeof error === 'string' && error) return <div>{error}</div>;
  if (!character) return <NotFound />;

  return (
    <main role="main">
      <Link to="/characters" aria-label="Back to list">← Back to list</Link>
      <article>
        <h1>{character.name as string}</h1>
        <img src="/assets/images/no-image.svg" alt={character.name as string} />
        {typeof character.description === 'string' && <p>{character.description}</p>}
        {Array.isArray(character.synonyms) && character.synonyms.length > 0 && (
          <div><strong>Synonyms:</strong> {(character.synonyms as string[]).join(', ')}</div>
        )}
        {Array.isArray(character.tags) && character.tags.length > 0 && (
          <div><strong>Tags:</strong> {(character.tags as string[]).join(', ')}</div>
        )}
        {Array.isArray(character.relations) && character.relations.length > 0 && (
          <div><strong>Relations:</strong> {(character.relations as string[]).join(', ')}</div>
        )}
      </article>
    </main>
  );
};

export default CharacterDetailPage; 