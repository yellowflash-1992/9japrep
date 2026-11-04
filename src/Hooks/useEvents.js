// hooks/useEvents.js
import { useState, useEffect } from 'react';

const USE_MOCK_DATA = true;   // set false when real API is ready

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            if (!USE_MOCK_DATA) {
                try {
                    const response = await fetch('https://api.example.com/education-events');
                    if (!response.ok) throw new Error('Failed to fetch events');
                    const result = await response.json();
                    setEvents(result);
                    setLoading(false);
                    return;
                } catch (err) {
                    setError(err.message);
                }
            }
            // always load mock in demo mode OR if real fetch fails
            setEvents([{
                    id: 1,
                    title: 'JAMB 2026 UTME Registration Begins',
                    date: 'Jan 15 - Feb 26, 2026',
                    type: 'registration',
                    description: 'Create your JAMB profile and register for the 2026 UTME.',
                    url: 'https://www.jamb.gov.ng'
                },
                {
                    id: 2,
                    title: 'WAEC May/June 2026 Exam Starts',
                    date: 'May 12, 2026',
                    type: 'exam',
                    description: 'The West African Senior School Certificate Examination commences.',
                    url: 'https://www.waecdirect.org'
                },
                {
                    id: 3,
                    title: 'NECO SSCE Internal Registration Deadline',
                    date: 'March 31, 2026',
                    type: 'deadline',
                    description: 'Last day to register for NECO internal candidates.',
                    url: 'https://www.neco.gov.ng'
                },
                {
                    id: 4,
                    title: 'UNILAG Post-UTME Screening',
                    date: 'July 10-15, 2026',
                    type: 'exam',
                    description: 'Post-UTME screening exercise for University of Lagos.',
                    url: 'https://unilag.edu.ng'
                },
                {
                    id: 5,
                    title: 'JAMB Mock Exam 2026',
                    date: 'March 30, 2026',
                    type: 'exam',
                    description: 'Optional mock examination for registered candidates.',
                    url: 'https://www.jamb.gov.ng'
                },
                {
                    id: 6,
                    title: 'PTDF Scholarship Application Opens',
                    date: 'June 1, 2026',
                    type: 'scholarship',
                    description: 'Petroleum Technology Development Fund overseas scholarship.',
                    url: 'https://ptdf.gov.ng'
                },
            ]);
            setLoading(false);
        };
        load();
    }, []);

    return { events, loading, error };
};