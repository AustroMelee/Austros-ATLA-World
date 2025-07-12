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
import CharacterDetailPage from './pages/CharacterDetailPage';
import FaunaDetailPage from './pages/FaunaDetailPage';
import LocationDetailPage from './pages/LocationDetailPage';
import FoodDetailPage from './pages/FoodDetailPage';
import SpiritWorldDetailPage from './pages/SpiritWorldDetailPage';

const AppRouter: React.FC = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/characters" element={<CharactersPage />} />
        <Route path="/characters/:slug" element={<CharacterDetailPage />} />
        <Route path="/bending" element={<BendingPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/locations/:slug" element={<LocationDetailPage />} />
        <Route path="/fauna" element={<FaunaPage />} />
        <Route path="/fauna/:slug" element={<FaunaDetailPage />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/food/:slug" element={<FoodDetailPage />} />
        <Route path="/spirit-world" element={<SpiritWorldPage />} />
        <Route path="/spirit-world/:slug" element={<SpiritWorldDetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  </Router>
);

export default AppRouter;
