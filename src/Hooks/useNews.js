// hooks/useNews.js
import { useState, useEffect } from 'react';

const USE_MOCK_DATA = true;   // set false when real API is ready

export const useNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            if (!USE_MOCK_DATA) {
                try {
                    const response = await fetch('https://api.example.com/education-news');
                    if (!response.ok) throw new Error('Failed to fetch news');
                    const result = await response.json();
                    setNews(result);
                    setLoading(false);
                    return;
                } catch (err) {
                    setError(err.message);
                }
            }
            // always load mock in demo mode OR if real fetch fails
            setNews([{
                    id: 1,
                    title: 'JAMB Announces 2026 UTME Registration Date',
                    source: 'JAMB Bulletin',
                    time: '2 hours ago',
                    image: '📢',
                    url: 'https://www.jamb.gov.ng/news'
                },
                {
                    id: 2,
                    title: 'WAEC Releases 2025 Nov/Dec Results – 72.3% Pass',
                    source: 'WAEC Nigeria',
                    time: 'Yesterday',
                    image: '📝',
                    url: 'https://www.waecdirect.org'
                },
                {
                    id: 3,
                    title: 'NECO Extends Registration Deadline for SSCE Internal',
                    source: 'NECO Official',
                    time: '3 days ago',
                    image: '⏰',
                    url: 'https://www.neco.gov.ng'
                },
                {
                    id: 4,
                    title: 'UNILAG Post-UTME Form Out – See Cut-off Marks',
                    source: 'Campus News',
                    time: '5 days ago',
                    image: '🎓',
                    url: 'https://unilag.edu.ng'
                },
                {
                    id: 5,
                    title: 'Federal Government Approves New Universities – See List',
                    source: 'NUC',
                    time: '1 week ago',
                    image: '🏛️',
                    url: 'https://www.nuc.edu.ng'
                },
                {
                    id: 6,
                    title: 'Tips to Score High in JAMB Use of English – Expert Advice',
                    source: 'FlashLearners',
                    time: '2 weeks ago',
                    image: '💡',
                    url: 'https://flashlearners.com'
                },
            ]);
            setLoading(false);
        };
        load();
    }, []);

    return { news, loading, error };
};