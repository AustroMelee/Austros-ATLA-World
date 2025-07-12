import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import CharactersPage from './pages/CharactersPage';
import BendingPage from './pages/BendingPage';
import LocationsPage from './pages/LocationsPage';
import FaunaPage from './pages/FaunaPage';
import FoodPage from './pages/FoodPage';
import SpiritWorldPage from './pages/SpiritWorldPage';
import NotFound from './pages/NotFound';
// Legacy detail page imports removed

const AppRouter: React.FC = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/characters" element={<CharactersPage />} />
        <Route path="/bending" element={<BendingPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/fauna" element={<FaunaPage />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/spirit-world" element={<SpiritWorldPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  </Router>
);

export default AppRouter;
