import React from 'react';
import * as styles from './Search.css';

const Search: React.FC = () => (
  <main className={styles.container}>
    <h1 className={styles.title}>Search Encyclopedia</h1>
    {/* TODO: Implement search logic */}
    <div className={styles.body}>Search results will appear here.</div>
  </main>
);

export default Search;
