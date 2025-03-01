'use client';

import { useEffect, useState } from "react";

const MatchList = () => {
    const [matches, setMatches] = useState([]);
    const [playerStats, setPlayerStats] = useState({});
    const [expandedMatch, setExpandedMatch] = useState(null);

    useEffect(() => {
        fetch('/api/get-matches')
            .then(response => response.json())
            .then(data => setMatches(data));
    }, []);

    useEffect(() => {
        fetch('/api/get-player-stats')
            .then(response => response.json())
            .then(data => {
                const statsMap = {};
                data.forEach(stat => {
                    if (!statsMap[stat.match_id]) {
                        statsMap[stat.match_id] = [];
                    }
                    statsMap[stat.match_id].push(stat);
                });
                console.log(statsMap);
                setPlayerStats(statsMap);
            });
    }, []);

    const toggleMatch = (matchId) => {
        setExpandedMatch(expandedMatch === matchId ? null : matchId);
    };

    
    const calculateRating = (player, match) => {
        const { kills, deaths, assists, adr, mvps } = player;
    
        // Prevent division by zero, normalize deaths impact
        const kdRatio = deaths > 0 ? kills / deaths : kills;
    
        // Weights for each stat (increased importance for kills, MVPs, and assists)
        const killWeight = 0.4;  // Increased weight for kills
        const kdWeight = 0.3;    // Decreased weight for KD ratio, but still significant
        const assistWeight = 0.3; // Higher weight for assists since they're a team play stat
        const adrWeight = 0.2;   // Still important, but less than the others
        const mvpWeight = 0.4;   // MVPs get a significant weight because they're tied to performance
    
        // Base rating calculation
        let rating = (
            (kills * killWeight) +
            (kdRatio * kdWeight) +
            (assists * assistWeight) +
            (adr / 100 * adrWeight) + // ADR normalized around 100
            (mvps * mvpWeight)
        );
    
        // Apply winner multiplier if the player’s team won
        if (match.winner === player.team) {
            rating *= 1.2;  // Winner multiplier (max rating cap still applies)
        }
    
        return rating / 10;
    };
    
    
    const deleteMatch = (matchId) => {
        fetch('/api/delete-match', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ matchId }),
        }).then(() => {
            setMatches(matches.filter((match) => match.id !== matchId));
            setPlayerStats({
                ...playerStats,
                [matchId]: [],
            });
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="space-y-4">
                {matches.map((match) => (
                    <div key={match.id} className="border rounded-lg p-4 shadow-md bg-gray-100">
                        <button 
                            onClick={() => toggleMatch(match.id)}
                            className="w-full text-left flex justify-between items-center font-semibold text-lg"
                        >
                            {match.map} - <span className="bg-white p-1 rounded-full">{match.score1}</span> {match.team1} vs {match.team2} <span className="bg-white p-1 rounded-full">{match.score2}</span>
                            <span className="text-green-600">Winner: {match.winner}</span>
                            <span className="bg-red-500 text-white p-1 rounded-lg cursor-pointer" onClick={() => deleteMatch(match.id)}>Delete</span>
                        </button>
                        {expandedMatch === match.id && (
                            <div className="mt-4 p-2 bg-white rounded shadow-inner">
                                <h3 className="font-semibold mb-2">Player Stats</h3>
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border p-2">Player</th>
                                            <th className="border p-2">Kills</th>
                                            <th className="border p-2">Deaths</th>
                                            <th className="border p-2">Assists</th>
                                            <th className="border p-2">ADR</th>
                                            <th className="border p-2">MVPs</th>
                                            <th className="border p-2">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {playerStats[match.id]
                                        ?.map((player) => ({
                                            ...player,
                                            calculatedRating: parseFloat(calculateRating(player, match)),
                                        }))
                                        .sort((a, b) => b.calculatedRating - a.calculatedRating) // Sort in descending order
                                        .map((player) => (
                                            <tr key={player.player_id} className={player.winner ? 'bg-green-100' : ''}>
                                                <td className="border p-2">{player.players?.name || ''}</td>
                                                <td className="border p-2">{player.kills}</td>
                                                <td className="border p-2">{player.deaths}</td>
                                                <td className="border p-2">{player.assists}</td>
                                                <td className="border p-2">{player.adr}</td>
                                                <td className="border p-2">{player.mvps}</td>
                                                <td className="border p-2">{player.calculatedRating.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MatchList;
