import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MatchHistory.css';
import { useLanguage } from './LanguageContext'; // Import language context
import translations from '../utility/translations'; // Import translations
import fetchChampionData from '../utility/fetchChampionData'; // Import dynamic fetch for champion data

const MatchHistory = ({ puuid }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const [championImageMap, setChampionImageMap] = useState({}); // State for dynamically fetched champion images
  const [expandedMatchIds, setExpandedMatchIds] = useState([]); // State to track expanded matches
  const { language } = useLanguage(); // Get the current language

  useEffect(() => {
    const fetchChampionsAndMatches = async () => {
      try {
        // Fetch champion images
        const champions = await fetchChampionData();
        setChampionImageMap(champions);
        
        // Fetch match IDs and match details
        const response = await axios.get(`/match-history/${puuid}`);
        const matchDetailsPromises = response.data.map(id => axios.get(`/match-details/${id}`));
        const matchDetailsResponses = await Promise.all(matchDetailsPromises);
        
        setMatches(matchDetailsResponses.map(res => res.data));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(translations[language].fetchError); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchChampionsAndMatches();
  }, [puuid, language]);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`; // Format duration as minutes and seconds
  };

  const handleMatchClick = (matchId) => {
    // Toggle the expanded match ID
    setExpandedMatchIds(prev => 
      prev.includes(matchId) ? prev.filter(id => id !== matchId) : [...prev, matchId]
    );
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
            const win = participant.win; // Check if the player won or lost
            const isExpanded = expandedMatchIds.includes(match.metadata.matchId); // Check if the match is expanded
            return (
              <React.Fragment key={match.metadata.matchId}>
                <li className={`match-item ${win ? 'victory' : 'defeat'}`} onClick={() => handleMatchClick(match.metadata.matchId)}>
                  {participant && (
                    <>
                      <strong className="match-result">
                        {win ? translations[language].victory : translations[language].defeat}
                      </strong>
                      <img 
                        src={championImageMap[participant.championName]} // Dynamically use championName to get the image
                        alt={`${participant.championName} Icon`} // Descriptive alt text
                        className="champion-icon" 
                      />
                      <div className="match-info">
                        <h3>{translations[language].matchId}: {match.metadata.matchId}</h3> {/* Translated match ID */}
                        <p>{translations[language].duration}: {formatDuration(match.info.gameDuration)}</p> {/* Translated duration */}
                        <p>{translations[language].champion}: {participant.championName}</p> {/* Translated champion */}
                        <p>{translations[language].kda}: {participant.kills}/{participant.deaths}/{participant.assists}</p> {/* Translated KDA */}
                        <p>{translations[language].gameType}: {match.info.queueId === 420 ? translations[language].ranked : translations[language].normal}</p> {/* Translated game type */}
                      </div>
                    </>
                  )}
                </li>
                {isExpanded && (
                  <div className="expanded-info">
                    <h4>{translations[language].additionalDetails}</h4>
                    <p>{translations[language].damageDealt}: {participant.totalDamageDealtToChampions}</p> {/* Total damage dealt */}
                    <p>{translations[language].visionScore}: {participant.visionScore}</p> {/* Vision score */}
                    <p>{translations[language].cs}: {participant.totalMinionsKilled + participant.neutralMinionsKilled}</p> {/* CS */}
                    {/* You can expand this section with more details as needed */}
                  </div>
                )}
              </React.Fragment>
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