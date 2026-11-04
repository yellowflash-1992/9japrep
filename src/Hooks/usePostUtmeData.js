// hooks/usePostUtmeData.js
import { useState, useEffect } from 'react';

const USE_MOCK_DATA = true;   // set false when real API is ready

export const usePostUtmeData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            if (!USE_MOCK_DATA) {
                try {
                    const response = await fetch('https://api.example.com/postutme/schools');
                    if (!response.ok) throw new Error('Failed to fetch');
                    const result = await response.json();
                    setData(result);
                    setLoading(false);
                    return;
                } catch (err) {
                    setError(err.message);
                }
            }
            // always load mock in demo mode OR if real fetch fails
            setData([
                { id: 1, name: 'University of Lagos', acronym: 'UNILAG', logo: '🎓', cutoff: 200 },
                { id: 2, name: 'University of Ibadan', acronym: 'UI', logo: '📚', cutoff: 200 },
                { id: 3, name: 'Obafemi Awolowo University', acronym: 'OAU', logo: '🌴', cutoff: 200 },
                { id: 4, name: 'Ahmadu Bello University', acronym: 'ABU', logo: '🏛️', cutoff: 180 },
                { id: 5, name: 'University of Nigeria', acronym: 'UNN', logo: '🦁', cutoff: 200 },
                { id: 6, name: 'Federal University of Technology, Akure', acronym: 'FUTA', logo: '⚙️', cutoff: 180 },
            ]);
            setLoading(false);
        };
        load();
    }, []);

    return { data, loading, error };
};