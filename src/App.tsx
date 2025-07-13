import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const App: React.FC = () => (
  <Router>
    <Layout>
      <div className="bg-slate-900 text-slate-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Layout>
  </Router>
);

export default App;
