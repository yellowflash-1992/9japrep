// hooks/useProjectMaterials.js
import { useState, useEffect } from 'react';

const USE_MOCK_DATA = true;   // set false when real API is ready

export const useProjectMaterials = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            if (!USE_MOCK_DATA) {
                try {
                    const response = await fetch('https://api.example.com/projects');
                    if (!response.ok) throw new Error('Failed to fetch projects');
                    const result = await response.json();
                    setProjects(result);
                    setLoading(false);
                    return;
                } catch (err) {
                    setError(err.message);
                }
            }
            // always load mock in demo mode OR if real fetch fails
            setProjects([
                { id: 1, title: 'Design and Implementation of a Student Result Management System', department: 'Computer Science', downloads: 234, format: 'PDF' },
                { id: 2, title: 'The Impact of Social Media on Academic Performance of Secondary School Students', department: 'Education', downloads: 189, format: 'DOC' },
                { id: 3, title: 'Construction of a 2KVA Automatic Voltage Regulator', department: 'Electrical Engineering', downloads: 156, format: 'PDF' },
                { id: 4, title: 'Effect of Treasury Single Account on Fraud Detection in Nigeria', department: 'Accounting', downloads: 312, format: 'PDF' },
                { id: 5, title: 'Design and Fabrication of a Mobile Deep Freezer', department: 'Mechanical Engineering', downloads: 98, format: 'PDF' },
                { id: 6, title: 'The Role of Microfinance Banks in Rural Development', department: 'Economics', downloads: 145, format: 'DOC' },
            ]);
            setLoading(false);
        };
        load();
    }, []);

    return { projects, loading, error };
};