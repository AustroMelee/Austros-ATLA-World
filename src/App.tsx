import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const App: React.FC = () => (
  <Router>
    <Layout>
      <div className="bg-zinc-950 text-neutral-200 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Layout>
  </Router>
);

export default App;
