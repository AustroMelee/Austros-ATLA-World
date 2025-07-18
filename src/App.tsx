import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeContainer from './pages/HomeContainer';
import NotFound from './pages/NotFound';
import { useCardExpansion } from './hooks/useCardExpansion';

export default function App() {
  const { expandedId } = useCardExpansion();
  const modalOpen = Boolean(expandedId);

  return (
    <>
      <div className="bg-neutral-900 hidden">force-tailwind-bg-neutral-900</div>
      <Router>
        <Layout modalOpen={modalOpen}>
          <Routes>
            <Route path="/" element={<HomeContainer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}
