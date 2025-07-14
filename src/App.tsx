import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeContainer from './pages/HomeContainer';
import NotFound from './pages/NotFound';

const App: React.FC = () => (
  <Router>
    <Layout>
      <div className="bg-zinc-950 text-neutral-200 min-h-screen">
        <Routes>
          <Route path="/" element={<HomeContainer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Layout>
  </Router>
);

export default App;
