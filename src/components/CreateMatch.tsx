'use client'

import { useState } from 'react';

const CreateMatch = () => {
  const [map, setMap] = useState('Dust2');
  const [team1, setTeam1] = useState('Team1');
  const [team2, setTeam2] = useState('Team2');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [winner, setWinner] = useState('Team1');

  const maps = ['Dust2', 'Inferno', 'Mirage', 'Nuke', 'Train', 'Ancient', 'Anubis'];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const matchData = { map, team1, team2, score1, score2, winner };
    // Call the API to create the match
    await fetch('/api/create-match', {
      method: 'POST',
      body: JSON.stringify(matchData),
    }).then((response) => {
      if (response.ok) {
        alert('Match created successfully');
        // Reset the form
        setMap('');
        setTeam1('Team1');
        setTeam2('Team2');
        setScore1(0);
        setScore2(0);
        setWinner('');
      } else {
        alert('An error occurred while creating the match');
      }
    }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col my-4">
      <select value={map} onChange={(e) => setMap(e.target.value)} required  className="border border-black w-full p-2 my-1 rounded-lg">
        {maps.map((map) => (
          <option key={map} value={map}>{map}</option>
        ))}
      </select>
      <input type="hidden" value={team1} onChange={(e) => setTeam1(e.target.value)} placeholder="Team 1" required  className="border border-black w-full p-2 my-1 rounded-lg"/>
      <input type="hidden" value={team2} onChange={(e) => setTeam2(e.target.value)} placeholder="Team 2" required  className="border border-black w-full p-2 my-1 rounded-lg"/>
      <input type="number" value={score1} onChange={(e) => setScore1(Number(e.target.value))} placeholder="Score 1" required  className="border border-black w-full p-2 my-1 rounded-lg"/>
      <input type="number" value={score2} onChange={(e) => setScore2(Number(e.target.value))} placeholder="Score 2" required  className="border border-black w-full p-2 my-1 rounded-lg"/>
      <select value={winner} onChange={(e) => setWinner(e.target.value)} required  className="border border-black w-full p-2 my-1 rounded-lg">
        <option value={team1}>{team1}</option>
        <option value={team2}>{team2}</option>
      </select>
      <button type="submit" className="btn cursor-pointer border border-green-800 p-2 bg-green-400 text-black font-bold rounded-full hover:bg-green-600">Stwórz mecz</button>
    </form>
  );
};

export default CreateMatch;
