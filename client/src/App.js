import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home';
import ProfilePage from './components/ProfilePage';
import SlideMenu from './components/SlideMenu';
import { LanguageProvider } from './components/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import NotFound from './components/NotFound'; // Assuming you have a NotFound component

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="app">
          <SlideMenu />
          <LanguageSelector />
          <div className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/:puuid/:name/:tag" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} /> {/* Fallback for unmatched routes */}
            </Routes>
          </div>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;