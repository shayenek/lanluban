'use client'

import { useEffect, useState } from 'react';

const SelectMatch = ({ matches, onMatchSelect }) => {
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [filteredMatches, setFilteredMatches] = useState([]);

    const filterMatches = () => {
        const unfinishedMatches = matches.filter((match) => !match.stats_finished);
        setFilteredMatches(unfinishedMatches);
    };

    useEffect(() => {
        filterMatches();
    }, [matches]);
    
    const handleChange = (e) => {
        const matchId = e.target.value;
        setSelectedMatch(matchId);
        
        // Pass match.id to the parent component
        if (onMatchSelect) {
            onMatchSelect(matchId);
        }
    };

    return (
        <select value={selectedMatch} onChange={handleChange} className="border border-black p-2">
            <option value="">Wybierz mecz</option>
            {filteredMatches.map((match) => (
                <option key={match.id} value={match.id}>{match.map} - {match.team1} vs {match.team2}</option>
            ))}
        </select>
    );
}

export default SelectMatch;
