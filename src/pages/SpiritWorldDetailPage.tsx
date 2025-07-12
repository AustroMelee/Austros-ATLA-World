import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import { getEntityBySlug, EnrichedRecord } from '../search/ClientSearchEngine';

const SpiritWorldDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [spirit, setSpirit] = useState<EnrichedRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      const data = getEntityBySlug(slug || '');
      setSpirit(data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (typeof error === 'string' && error) return <div>{error}</div>;
  if (!spirit) return <NotFound />;

  return (
    <main role="main">
      <Link to="/spirit-world" aria-label="Back to list">← Back to list</Link>
      <article>
        <h1>{spirit.name as string}</h1>
        <img src="/assets/images/no-image.svg" alt={spirit.name as string} />
        {typeof spirit.description === 'string' && <p>{spirit.description}</p>}
        {Array.isArray(spirit.synonyms) && spirit.synonyms.length > 0 && (
          <div><strong>Synonyms:</strong> {(spirit.synonyms as string[]).join(', ')}</div>
        )}
        {Array.isArray(spirit.tags) && spirit.tags.length > 0 && (
          <div><strong>Tags:</strong> {(spirit.tags as string[]).join(', ')}</div>
        )}
        {Array.isArray(spirit.relations) && spirit.relations.length > 0 && (
          <div><strong>Relations:</strong> {(spirit.relations as string[]).join(', ')}</div>
        )}
      </article>
    </main>
  );
};

export default SpiritWorldDetailPage; 