import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import { getEntityBySlug, EnrichedRecord } from '../search/ClientSearchEngine';

const FaunaDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [fauna, setFauna] = useState<EnrichedRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      const data = getEntityBySlug(slug || '');
      setFauna(data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (typeof error === 'string' && error) return <div>{error}</div>;
  if (!fauna) return <NotFound />;

  return (
    <main role="main">
      <Link to="/fauna" aria-label="Back to list">← Back to list</Link>
      <article>
        <h1>{fauna.name as string}</h1>
        <img src="/assets/images/no-image.svg" alt={fauna.name as string} />
        {typeof fauna.description === 'string' && <p>{fauna.description}</p>}
        {Array.isArray(fauna.synonyms) && fauna.synonyms.length > 0 && (
          <div><strong>Synonyms:</strong> {(fauna.synonyms as string[]).join(', ')}</div>
        )}
        {Array.isArray(fauna.tags) && fauna.tags.length > 0 && (
          <div><strong>Tags:</strong> {(fauna.tags as string[]).join(', ')}</div>
        )}
        {Array.isArray(fauna.relations) && fauna.relations.length > 0 && (
          <div><strong>Relations:</strong> {(fauna.relations as string[]).join(', ')}</div>
        )}
      </article>
    </main>
  );
};

export default FaunaDetailPage; 