import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MatchHistory from './MatchHistory';
import axios from 'axios';
import './ProfilePage.css'; // Import the CSS file

const ProfilePage = () => {
  const { puuid, name, tag } = useParams(); // Get the PUUID, name, and tag from the URL parameters
  const [summonerData, setSummonerData] = useState(null);
  const [error, setError] = useState('');
  const [matchHistoryRefresh, setMatchHistoryRefresh] = useState(false); // State to trigger refresh
  const [lastRefreshed, setLastRefreshed] = useState(null); // State to store last refresh time

  useEffect(() => {
    const fetchSummonerData = async () => {
      try {
        const response = await axios.get(`/summoner/${puuid}`);
        setSummonerData(response.data);
      } catch (err) {
        console.error('Error fetching summoner data:', err);
        setError('Failed to fetch summoner data.');
      }
    };

    if (puuid) {
      fetchSummonerData();
    }
  }, [puuid]);

  const refreshMatchHistory = () => {
    // Toggle state to trigger match history refresh
    setMatchHistoryRefresh(prevState => !prevState);
    // Update the last refreshed time
    setLastRefreshed(new Date().toLocaleString());
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {summonerData && (
        <div>
          <h3 className="profile-name">{name} <span className="profile-tag">({tag})</span></h3>
          <img 
            className="profile-icon"
            src={`https://ddragon.leagueoflegends.com/cdn/14.18.1/img/profileicon/${summonerData.profileIconId}.png`} 
            alt={`${name}'s Profile Icon`} 
          />
          <p className="profile-level">Level: {summonerData.summonerLevel}</p>
        </div>
      )}

      <button className="refresh-button" onClick={refreshMatchHistory}>Refresh Match History</button>
      <p className="last-refreshed">
        {lastRefreshed ? `Last Refreshed: ${lastRefreshed}` : 'Not refreshed yet'}
      </p>

      <MatchHistory puuid={puuid} key={matchHistoryRefresh} /> {/* Pass the refresh state as a key to force rerender */}
    </div>
  );
};

export default ProfilePage;