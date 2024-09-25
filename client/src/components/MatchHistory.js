import React, { useEffect, useState } from 'react';
import axios from 'axios';
import championImageMap from '../utility/championImageMap'; // Adjust the path as needed
import './MatchHistory.css';
import { useLanguage } from './LanguageContext'; // Import language context
import translations from '../utility/translations'; // Import translations

const MatchHistory = ({ puuid }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const { language } = useLanguage(); // Get the current language

  useEffect(() => {
    const fetchMatchIds = async () => {
      try {
        const response = await axios.get(`/match-history/${puuid}`);
        fetchMatchDetails(response.data); // Fetch match details with the retrieved IDs
      } catch (error) {
        console.error('Error fetching match IDs:', error);
        setError(translations[language].fetchError); // Set error message
      }
    };

    const fetchMatchDetails = async (ids) => {
      const matchDetailsPromises = ids.map(id => axios.get(`/match-details/${id}`));
      try {
        const matchDetailsResponses = await Promise.all(matchDetailsPromises);
        setMatches(matchDetailsResponses.map(res => res.data));
      } catch (error) {
        console.error('Error fetching match details:', error);
        setError(translations[language].fetchError); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchMatchIds();
  }, [puuid, language]);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`; // Format duration as minutes and seconds
  };

  return (
    <div>
      <h2>{translations[language].matchHistory}</h2> {/* Translated match history title */}
      {loading && <p>Loading match history...</p>} {/* Loading indicator */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Error message */}
      {matches.length > 0 ? (
        <ul>
          {matches.map(match => {
            const participant = match.info.participants.find(p => p.puuid === puuid);
            return (
              <li key={match.metadata.matchId}>
                {participant && (
                  <>
                    <img 
                      src={championImageMap[participant.championName]} // Use championName to get the image
                      alt={`${participant.championName} Icon`} // Descriptive alt text
                      className="champion-icon" 
                    />
                    <div className="match-info">
                      <h3>{translations[language].matchId}: {match.metadata.matchId}</h3> {/* Translated match ID */}
                      <p>{translations[language].duration}: {formatDuration(match.info.gameDuration)}</p> {/* Translated duration */}
                      <p>{translations[language].winner}: {match.info.teams[0].win ? translations[language].team1 : translations[language].team2}</p> {/* Translated winner */}
                      <p>{translations[language].champion}: {participant.championName}</p> {/* Translated champion */}
                      <p>{translations[language].kda}: {participant.kills}/{participant.deaths}/{participant.assists}</p> {/* Translated KDA */}
                      <p>{translations[language].gameType}: {match.info.queueId === 420 ? translations[language].ranked : translations[language].normal}</p> {/* Translated game type */}
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>{translations[language].noMatches}</p> // Message if there are no matches
      )}
    </div>
  );
};

export default MatchHistory;