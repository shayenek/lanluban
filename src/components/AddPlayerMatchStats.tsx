'use client'

import { useEffect, useState } from 'react';
import SelectMatch from './SelectMatch';

const AddPlayerMatchStats = ({ players }) => {
  const [playerStats, setPlayerStats] = useState(
    players.map((player) => ({
      player_id: player.id,
      match_id: null,
      kills: 0,
      deaths: 0,
      assists: 0,
      adr: 0,
      mvps: 0,
      winner: false,
    }))
  );

  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [filteredMatches, setFilteredMatches] = useState(matches);

  useEffect(() => {
    fetch('/api/get-matches')
        .then((response) => response.json())
        .then((data) => {
            setMatches(data);
        });
}, []);

  useEffect(() => {
    const unfinishedMatches = matches.filter((match) => !match.stats_finished);
    setFilteredMatches(unfinishedMatches);
  }, [matches]);

  const handleChange = (index, field, value) => {
    const updatedStats = [...playerStats];
    updatedStats[index][field] = value;
    setPlayerStats(updatedStats);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const body = JSON.stringify({ selectedMatchId, playerStats });
    await fetch('/api/add-player-stats', {
      method: 'POST',
      body,
    }).then((response) => {
      if (response.ok) {
        alert('Stats saved successfully');
        setPlayerStats(
          players.map((player) => ({
            player_id: player.id,
            match_id: selectedMatchId,
            kills: 0,
            deaths: 0,
            assists: 0,
            adr: 0,
            mvps: 0,
            winner: false,
          }))
        );
        setSelectedMatchId(null);
        // remove the match from the list
        const updatedMatches = filteredMatches.filter((match) => match.id !== Number(selectedMatchId));
        setFilteredMatches(updatedMatches);
      } else {
        alert('An error occurred while saving the stats');
      }
    });
  };

  const setWinningPlayers = (matchId) => {
    const match = filteredMatches.find((match) => match.id === Number(matchId));
    const updatedStats = playerStats.map((stats) => {
      const player = players.find((player) => player.id === stats.player_id);
      if (match.winner.toLowerCase() === player.team.toLowerCase()) {
        return { ...stats, winner: true };
      }
      return { ...stats, winner: false };
    });
    setPlayerStats(updatedStats);
  };

  const handleMatchSelect = (matchId) => {
    setSelectedMatchId(matchId);
    setWinningPlayers(matchId);

    setPlayerStats((prevStats) =>
      prevStats.map((stats) => ({
        ...stats,
        match_id: matchId,
      }))
    );
  };

  return (
    <>
      <div className="flex items-center justify-center gap-6 mt-4">Mecz: <SelectMatch matches={filteredMatches} onMatchSelect={handleMatchSelect} /></div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {playerStats.map((stats, index) => (
            <div key={stats.player_id} className="flex flex-col w-full  border-green-800 border-2 rounded-lg p-2">
              <h3 className="text-lg">{players[index].name}</h3>
              <hr className="my-2"/>
              <div className="flex flex-row w-full justify-center">
                <div className="flex flex-col">
                  <div className="m-1">Kills</div>
                  <input
                    className="border border-black p-2 m-1 w-11/12"
                    type="number"
                    value={stats.kills}
                    onChange={(e) => handleChange(index, 'kills', e.target.value)}
                    placeholder="Kills"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="m-1">Deaths</div>
                  <input
                    className="border border-black p-2 m-1 w-11/12"
                    type="number"
                    value={stats.deaths}
                    onChange={(e) => handleChange(index, 'deaths', e.target.value)}
                    placeholder="Deaths"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="m-1">Assists</div>
                  <input
                    className="border border-black p-2 m-1 w-11/12"
                    type="number"
                    value={stats.assists}
                    onChange={(e) => handleChange(index, 'assists', e.target.value)}
                    placeholder="Assists"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="m-1">ADR</div>
                  <input
                    className="border border-black p-2 m-1 w-11/12"
                    type="number"
                    value={stats.adr}
                    onChange={(e) => handleChange(index, 'adr', e.target.value)}
                    placeholder="ADR"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="m-1">MVPS</div>
                  <input
                    className="border border-black p-2 m-1 w-11/12"
                    type="number"
                    value={stats.mvps}
                    onChange={(e) => handleChange(index, 'mvps', e.target.value)}
                    placeholder="MVPS"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="m-1">Winner</div>
                  <input
                    className="border border-black p-2 m-1 w-11/12"
                    type="checkbox"
                    checked={stats.winner}
                    onChange={(e) => handleChange(index, 'winner', e.target.checked)}
                  />
                  </div>
              </div>
            </div>
          ))}
        </div>
        <button type="submit" className="btn cursor-pointer border border-green-800 p-2 bg-green-400 text-black font-bold rounded-full hover:bg-green-600 w-full my-4">Zapisz staty</button>
      </form>
    </>
  );
};

export default AddPlayerMatchStats;
