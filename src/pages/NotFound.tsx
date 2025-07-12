import React from 'react';
import * as styles from './NotFound.css';

const NotFound: React.FC = () => (
  <main className={styles.container}>
    <h1 className={styles.title}>404 - Not Found</h1>
    <p className={styles.message}>Sorry, the page you are looking for does not exist.</p>
    <a href="/" className={styles.link}>Go Home</a>
  </main>
);

export default NotFound;
