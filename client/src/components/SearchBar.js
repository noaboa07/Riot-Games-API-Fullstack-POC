import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css'; // Import the CSS file for styles
import { useLanguage } from './LanguageContext';
import translations from '../utility/translations';

const SearchBar = () => {
  const [summonerName, setSummonerName] = useState('');
  const [summonerTag, setSummonerTag] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage(); // Get the current language

  const handleSearch = async () => {
    // Normalize inputs to lowercase for case-insensitive search
    const normalizedSummonerName = summonerName.toLowerCase();
    const normalizedSummonerTag = summonerTag.toLowerCase();

    if (!normalizedSummonerName || !normalizedSummonerTag) {
      setErrorMessage('Please enter both summoner name and tag.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const response = await axios.get(`/account/${normalizedSummonerName}/${normalizedSummonerTag}`);
      const puuid = response.data.puuid;
      // Navigate to the profile page with puuid, summoner name, and tag
      navigate(`/profile/${puuid}/${normalizedSummonerName}/${normalizedSummonerTag}`);
    } catch (error) {
      console.error('Error fetching summoner data:', error);
      setErrorMessage('Failed to fetch summoner data. Please check the name and tag.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder={translations[language].searchForSummoner} // Translated placeholder
        value={summonerName}
        onChange={(e) => setSummonerName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Handle Enter key
      />
      <input
        type="text"
        className="search-input"
        placeholder={translations[language].tag} // Translated placeholder
        value={summonerTag}
        onChange={(e) => setSummonerTag(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Handle Enter key
      />
      <button className="search-button" onClick={handleSearch} disabled={loading}>
        {loading ? 'Loading...' : translations[language].search} {/* Translated button text */}
      </button>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Error message display */}
    </div>
  );
};

export default SearchBar;