import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeContainer from './pages/HomeContainer';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <div className="bg-neutral-900 hidden">force-tailwind-bg-neutral-900</div>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomeContainer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}
