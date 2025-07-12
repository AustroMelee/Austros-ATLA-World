import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import { getEntityBySlug, EnrichedRecord } from '../search/ClientSearchEngine';

const LocationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useState<EnrichedRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      const data = getEntityBySlug(slug || '');
      setLocation(data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (typeof error === 'string' && error) return <div>{error}</div>;
  if (!location) return <NotFound />;

  return (
    <main role="main">
      <Link to="/locations" aria-label="Back to list">← Back to list</Link>
      <article>
        <h1>{location.name as string}</h1>
        <img src="/assets/images/no-image.svg" alt={location.name as string} />
        {typeof location.description === 'string' && <p>{location.description}</p>}
        {Array.isArray(location.synonyms) && location.synonyms.length > 0 && (
          <div><strong>Synonyms:</strong> {(location.synonyms as string[]).join(', ')}</div>
        )}
        {Array.isArray(location.tags) && location.tags.length > 0 && (
          <div><strong>Tags:</strong> {(location.tags as string[]).join(', ')}</div>
        )}
        {Array.isArray(location.relations) && location.relations.length > 0 && (
          <div><strong>Relations:</strong> {(location.relations as string[]).join(', ')}</div>
        )}
      </article>
    </main>
  );
};

export default LocationDetailPage; 