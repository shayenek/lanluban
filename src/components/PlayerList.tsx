'use client';

import { useEffect, useState } from "react";

const PlayerList = () => {
    const [players, setPlayers] = useState([]);
    const [playerStats, setPlayerStats] = useState([]);
    const [matches, setMatches] = useState([]); // Assuming matches data is fetched here

    useEffect(() => {
        fetch('/api/get-players')
            .then(response => response.json())
            .then(data => setPlayers(data));
    }, []);

    useEffect(() => {
        fetch('/api/get-player-stats')
            .then(response => response.json())
            .then(data => setPlayerStats(data));
    }, []);

    useEffect(() => {
        fetch('/api/get-matches')  // Fetch match data
            .then(response => response.json())
            .then(data => setMatches(data));
    }, []);

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
        if (match && match.winner === player.team) {
            rating *= 1.2;  // Winner multiplier (max rating cap still applies)
        }

        return rating / 10;
    };

    const summarizePlayerStats = () => {
        const summary = {};

        players.forEach(player => {
            summary[player.id] = {
                name: player.name,
                kills: 0,
                deaths: 0,
                assists: 0,
                adr: 0,
                mvps: 0,
                matches: 0,
                totalRating: 0,
                totalMatchRating: 0,  // To sum ratings per match
            };
        });

        playerStats.forEach(stat => {
            const playerId = stat.player_id;

            if (!summary[playerId]) {
                summary[playerId] = {
                    name: stat.players?.name || "Unknown",
                    kills: 0,
                    deaths: 0,
                    assists: 0,
                    adr: 0,
                    mvps: 0,
                    matches: 0,
                    totalRating: 0,
                    totalMatchRating: 0,
                };
            }

            summary[playerId].kills += stat.kills;
            summary[playerId].deaths += stat.deaths;
            summary[playerId].assists += stat.assists;
            summary[playerId].adr += stat.adr;
            summary[playerId].mvps += stat.mvps;
            summary[playerId].matches += 1;
        });

        // Calculate ratings for each player based on their total stats across all matches
        Object.keys(summary).forEach(playerId => {
            const player = summary[playerId];
            let totalRating = 0;

            // Loop through all the player's stats across matches and calculate rating per match
            playerStats.forEach(stat => {
                if (stat.player_id === Number(playerId)) {
                    const match = matches.find(m => m.id === stat.match_id); // Assuming match_id in playerStats
                    totalRating += parseFloat(calculateRating(stat, match));
                }
            });

            player.totalRating = (totalRating / player.matches).toFixed(2);  // Average rating across all matches
        });

        return Object.values(summary).sort((a, b) => b.totalRating - a.totalRating);
    };

    const summarizedStats = summarizePlayerStats();

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Player Summary</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Player</th>
                        <th className="border p-2">Kills</th>
                        <th className="border p-2">Deaths</th>
                        <th className="border p-2">Assists</th>
                        <th className="border p-2">Avg ADR</th>
                        <th className="border p-2">MVPs</th>
                        <th className="border p-2">Matches</th>
                        <th className="border p-2">Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {summarizedStats.map((player, index) => (
                        <tr key={index}>
                            <td className="border p-2">{player.name}</td>
                            <td className="border p-2">{player.kills}</td>
                            <td className="border p-2">{player.deaths}</td>
                            <td className="border p-2">{player.assists}</td>
                            <td className="border p-2">{player.matches > 0 ? (player.adr / player.matches).toFixed(2) : '0'}</td>
                            <td className="border p-2">{player.mvps}</td>
                            <td className="border p-2">{player.matches}</td>
                            <td className="border p-2 font-bold">{player.totalRating}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlayerList;
