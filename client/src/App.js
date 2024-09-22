import React from 'react';
import MatchHistory from './components/MatchHistory';

const App = () => {
  const puuid = 'your-puuid-here'; // Replace with actual value

  return (
    <div>
      <MatchHistory puuid={puuid} />
    </div>
  );
};

export default App;
