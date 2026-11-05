import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaCheck } from 'react-icons/fa';
import { ExamStateContext } from "../Helpers/Contexts";

const SUBJECTS = ['english', 'mathematics', 'biology', 'geography'];

export default function SubjectSelect() {
    const { waecSelectedSubjects, setWaecSelectedSubjects } = useContext(ExamStateContext);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const cleaned = waecSelectedSubjects.filter(subject => SUBJECTS.includes(subject));
        if (cleaned.length !== waecSelectedSubjects.length) {
            setWaecSelectedSubjects(cleaned);
        }
    }, [waecSelectedSubjects, setWaecSelectedSubjects]);

    const Min_Subjects = 1;
    const Max_Subjects = 4;

    const filteredSubjects = SUBJECTS.filter(subject =>
        subject.includes(searchTerm.toLowerCase())
    );

    const isSelectionValid = waecSelectedSubjects.length >= Min_Subjects;
    const isAtMax = waecSelectedSubjects.length >= Max_Subjects;

    const toggleSubject = (subjectId) => {
        setWaecSelectedSubjects(currentSubjects => {
            if (currentSubjects.includes(subjectId)) {
                return currentSubjects.filter(subject => subject !== subjectId);
            }

            if (currentSubjects.length >= Max_Subjects) {
                return currentSubjects;
            }

            return [...currentSubjects, subjectId];
        });
    };

    const handleProceed = () => {
        if (isSelectionValid) {
            navigate("/new-exam-config");
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Select Subjects</h1>
                <p className="text-slate-500">Pick up to {Max_Subjects} subjects to start your practice.</p>
            </header>

            {/* --- Search Box --- */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search for a subject..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* --- Subject List with Checkboxes --- */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subject) => {
                        const isSelected = waecSelectedSubjects.includes(subject);
                        const isDisabled = isAtMax && !isSelected;

                        return (
                            <label
                                key={subject}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                                    ${isSelected 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-slate-100 hover:border-slate-200 bg-white'}
                                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="w-6 h-6 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                                            checked={isSelected}
                                            disabled={isDisabled}
                                            onChange={() => toggleSubject(subject)}
                                        />
                                    </div>
                                    <span className={`font-semibold text-lg ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                                        {subject.charAt(0).toUpperCase() + subject.slice(1)}
                                    </span>
                                </div>
                                
                                {isSelected && <FaCheck className="text-blue-500" />}
                            </label>
                        );
                    })
                ) : (
                    <div className="text-center py-10 text-slate-400 italic">
                        No subjects found matching "{searchTerm}"
                    </div>
                )}
            </div>

            {/* --- Action Footer --- */}
            <footer className="mt-10 pt-6 border-t border-slate-100 flex flex-col items-center">
                <div className="mb-4 text-center">
                    <span className={`text-sm font-medium ${isSelectionValid ? 'text-green-600' : 'text-slate-500'}`}>
                        {waecSelectedSubjects.length === 0
                            ? "Please select at least 1 subject"
                            : `Selected ${waecSelectedSubjects.length} of ${Max_Subjects} subjects`}
                    </span>
                </div>

                <button
                    onClick={handleProceed}
                    disabled={!isSelectionValid}
                    className={`w-full md:w-auto max-w-sm px-6 py-2.5 text-sm md:text-base font-semibold rounded-lg transition-all transform
                        ${isSelectionValid
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl active:scale-95'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    {isSelectionValid ? 'Proceed to Configuration' : 'Select a Subject'}
                </button>
            </footer>
        </div>
    );
}