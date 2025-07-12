import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import { getEntityBySlug, EnrichedRecord } from '../search/ClientSearchEngine';

const FoodDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [food, setFood] = useState<EnrichedRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      const data = getEntityBySlug(slug || '');
      setFood(data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (typeof error === 'string' && error) return <div>{error}</div>;
  if (!food) return <NotFound />;

  return (
    <main role="main">
      <Link to="/food" aria-label="Back to list">← Back to list</Link>
      <article>
        <h1>{food.name as string}</h1>
        <img src="/assets/images/no-image.svg" alt={food.name as string} />
        {typeof food.description === 'string' && <p>{food.description}</p>}
        {Array.isArray(food.synonyms) && food.synonyms.length > 0 && (
          <div><strong>Synonyms:</strong> {(food.synonyms as string[]).join(', ')}</div>
        )}
        {Array.isArray(food.tags) && food.tags.length > 0 && (
          <div><strong>Tags:</strong> {(food.tags as string[]).join(', ')}</div>
        )}
        {Array.isArray(food.relations) && food.relations.length > 0 && (
          <div><strong>Relations:</strong> {(food.relations as string[]).join(', ')}</div>
        )}
      </article>
    </main>
  );
};

export default FoodDetailPage; 