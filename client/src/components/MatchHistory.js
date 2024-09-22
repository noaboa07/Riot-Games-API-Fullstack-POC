import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MatchHistory.css';

const MatchHistory = ({ puuid }) => {
  const [matchIds, setMatchIds] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatchIds = async () => {
      try {
        const response = await axios.get(`/match-history/${puuid}`);
        setMatchIds(response.data);
        fetchMatchDetails(response.data);
      } catch (error) {
        console.error('Error fetching match IDs:', error);
      }
    };

    const fetchMatchDetails = async (ids) => {
      const matchDetailsPromises = ids.map(id => axios.get(`/match-details/${id}`));
      try {
        const matchDetailsResponses = await Promise.all(matchDetailsPromises);
        setMatches(matchDetailsResponses.map(res => res.data));
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    fetchMatchIds();
  }, [puuid]);

  return (
    <div>
      <h2>Match History</h2>
      <ul>
        {matches.map(match => (
          <li key={match.id}>
            Match ID: {match.id} | Duration: {match.info.gameDuration} seconds | Winner: {match.info.teams[0].win ? 'Team 1' : 'Team 2'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchHistory;