'use client';  // Add this directive to indicate it's a client-side component

import { useState } from 'react';

const PlayerRatingCalculator = () => {
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [mvps, setMVPs] = useState(0);
  const [rating, setRating] = useState(null);

  // Adjusted formula for player rating to ensure it rarely goes above 2
  const calculateRating = () => {
    // Scale down the points to ensure the rating stays within a smaller range
    const killRating = kills * 0.1;  // Each kill gives 0.1 points
    const deathPenalty = deaths * 0.05;  // Each death deducts 0.05 points
    const mvpBonus = mvps * 0.3;  // Each MVP gives 0.3 points

    const totalRating = Math.max(0, killRating - deathPenalty + mvpBonus); // Ensure rating doesn't go below 0
    setRating(totalRating.toFixed(2));  // Limit to 2 decimal places for cleaner display
  };

  return (
    <div>
      <h2>Player Rating Calculator</h2>
      <div>
        <label>
          Kills:
          <input
            type="number"
            value={kills}
            onChange={(e) => setKills(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Deaths:
          <input
            type="number"
            value={deaths}
            onChange={(e) => setDeaths(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          MVPs:
          <input
            type="number"
            value={mvps}
            onChange={(e) => setMVPs(Number(e.target.value))}
          />
        </label>
      </div>
      <button onClick={calculateRating}>Calculate Rating</button>

      {rating !== null && (
        <div>
          <h3>Player Rating: {rating}</h3>
        </div>
      )}
    </div>
  );
};

export default PlayerRatingCalculator;
