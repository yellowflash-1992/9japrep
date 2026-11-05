import React, { useEffect, useContext } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { useExam } from '../Hooks/useLogic'; 
import { ExamStateContext } from "../Helpers/Contexts";
import { FaFlag, FaChevronRight, FaChevronLeft, FaTh, FaCalculator } from 'react-icons/fa';
import Timer from '../Components/Timer';

export default function ExamPage() {
    const { subjectId } = useParams();
    const { waecConfig, waecSelectedSubjects } = useContext(ExamStateContext);
    const navigate = useNavigate();
    
    const { 
        activeName, questions, currentQuestion, answers, flagged, 
        isLoading, isLastSubject, normalizedSelected,
        chooseOption, jumpToQuestion, toggleFlag, nextQuestion, finishExam
    } = useExam(subjectId);

  useEffect(() => {
        const isPlaceholder = subjectId === ":subjectId";
        // Create a reliable array of subjects to check against
        const availableSubjects = (normalizedSelected && normalizedSelected.length > 0) 
            ? normalizedSelected 
            : waecSelectedSubjects;

        if ((!subjectId || isPlaceholder) && availableSubjects?.length > 0) {
            // Handle whether the context stores them as strings or objects
            const firstSubject = availableSubjects[0];
            const firstId = typeof firstSubject === 'string' ? firstSubject : (firstSubject.name || firstSubject.subject || firstSubject.id);
            
            if (firstId) {
                navigate(`/new-exam-page/${firstId}`, { replace: true });
            }
        }
    }, [subjectId, normalizedSelected, waecSelectedSubjects, navigate]);

    const q = questions[currentQuestion];

    if (isLoading) return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-600 font-bold animate-pulse">PREPARING EXAMINATION...</p>
            </div>
        </div>
    );

    if (questions.length === 0) return (
        <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-slate-50">
            <p className="text-slate-600 font-bold">Loading failed. Please go back.</p>
            <button
                onClick={() => navigate("/new-select-subject")}
                className="rounded-lg bg-rose-600 px-5 py-2 font-bold text-white hover:bg-rose-700"
            >
                Back to subject selection
            </button>
        </div>
    );

    return (
        <div className="h-screen w-full bg-slate-100 flex flex-col overflow-hidden font-sans">
            
            {/* TOP HEADER: CANDIDATE INFO & TIMER */}
            <header className="min-h-16 h-auto md:h-16 bg-rose-700 text-white px-4 md:px-8 py-3 md:py-0 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-0 shadow-lg z-30">
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <p className="text-[10px] uppercase opacity-70 font-bold leading-none">Candidate</p>
                        <p className="text-sm font-black truncate max-w-[150px]">{activeName}</p>
                    </div>
                    <div className="h-8 w-[1px] bg-rose-500 hidden md:block"></div>
                    <div>
                        <p className="text-[10px] uppercase opacity-70 font-bold leading-none">Subject</p>
                        <p className="text-sm font-black uppercase">{subjectId}</p>
                    </div>
                </div>

                <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-6">
                    <Timer 
                        duration={waecConfig?.duration || 45} 
                        onTimeUp={finishExam} 
                        storageKey="waec_exam_session" 
                        className="bg-white/10 border border-white/20 px-4 py-1.5 rounded-lg font-mono text-xl font-black"
                    />
                    <button 
                        onClick={() => { if(window.confirm("Finish and Submit?")) finishExam() }}
                        className="w-full md:w-auto px-6 py-2.5 text-sm md:text-base font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-sm"
                    >
                        SUBMIT
                    </button>
                </div>
            </header>

            {/* SUBJECT TABS: CLEAN & SMART NAVIGATION */}
         {/* SUBJECT TABS: BULLETPROOF NAVIGATION */}
            <nav className="bg-white border-b border-slate-200 flex overflow-x-auto shrink-0 z-20 shadow-sm">
                {/* Fallback to waecSelectedSubjects if normalizedSelected is empty */}
                {((normalizedSelected && normalizedSelected.length > 0) ? normalizedSelected : (waecSelectedSubjects || [])).map((item, index) => {
                    
                    // Extract the correct ID regardless of how the data is shaped
                    const id = typeof item === 'string' ? item : (item?.name || item?.id || item?.subject || `subject-${index}`);
                    if (!id) return null;

                    const isActive = subjectId === id;
                    
                    return (
                        <NavLink 
                            key={id} 
                            to={`/new-exam-page/${id}`} 
                            className={`px-8 py-4 border-b-4 transition-all whitespace-nowrap flex items-center gap-2 ${
                                isActive 
                                ? 'border-rose-600 text-rose-600 bg-rose-50 font-black' 
                                : 'border-transparent text-slate-400 hover:bg-slate-50 font-bold hover:text-slate-600'
                            }`}
                        >
                            <span className="text-[12px] uppercase tracking-widest">{id}</span>
                        </NavLink>
                    );
                })}
            </nav>
            
            {/* MAIN INTERFACE: SPLIT VIEW */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* LEFT: QUESTION CONTENT */}
                <main className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto bg-[#f8fafc]">
                    <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
                        
                        {/* Question Number Indicator */}
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Question {currentQuestion + 1} of {questions.length}
                            </span>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="Calculator"><FaCalculator /></button>
                            </div>
                        </div>

                        {/* The Question Box */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mb-6">
                            <h2 className="text-lg md:text-xl font-semibold text-slate-800 leading-snug">
                                {q?.prompt}
                            </h2>
                        </div>

                        {/* Options Grid: 2 columns to save height */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                            {q?.options.map((option, idx) => {
                                const isSelected = answers[currentQuestion] === idx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => chooseOption(idx)}
                                        className={`group flex items-center p-3 rounded-xl border-2 transition-all text-left relative ${
                                            isSelected 
                                            ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-sm' 
                                            : 'border-slate-100 bg-white text-slate-600 hover:border-rose-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm mr-3 shrink-0 ${
                                            isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className="text-[15px] font-medium leading-tight">{option}</span>
                                        {isSelected && <div className="absolute top-2 right-2 w-2 h-2 bg-rose-600 rounded-full"></div>}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Pager / Navigation Footer */}
                        <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-200">
                            <button 
                                disabled={currentQuestion === 0}
                                onClick={() => jumpToQuestion(currentQuestion - 1)}
                                className="flex items-center gap-2 font-bold text-slate-500 disabled:opacity-30 hover:text-rose-600 transition-all px-4 py-2"
                            >
                                <FaChevronLeft /> PREV
                            </button>

                            <div className="flex gap-3">
                                <button 
                                    onClick={toggleFlag}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-xl border-2 font-bold text-sm transition-all ${
                                        flagged.includes(currentQuestion) 
                                        ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200' 
                                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                    }`}
                                >
                                    <FaFlag size={12} /> <span className="hidden md:inline">TAG</span>
                                </button>

                                <button 
                                    onClick={nextQuestion}
                                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-sm flex items-center gap-3 hover:bg-black transition-all shadow-lg active:scale-95"
                                >
                                    {currentQuestion === questions.length - 1 ? (isLastSubject ? 'FINISH' : 'NEXT SUBJECT') : 'NEXT'}
                                    <FaChevronRight size={12}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* RIGHT: MINI-MAP (QUESTION GRID) - Familiar WAEC feature */}
                <aside className="hidden lg:flex w-72 bg-white border-l border-slate-200 flex-col p-6 overflow-y-auto">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <FaTh /> Navigation Map
                    </h4>
                    
                    <div className="grid grid-cols-5 gap-2">
                        {questions.map((_, idx) => {
                            const isAnswered = answers[idx] !== undefined && answers[idx] !== null;
                            const isCurrent = currentQuestion === idx;
                            const isFlagged = flagged.includes(idx);
                            
                            return (
                                <button
                                    key={idx}
                                    onClick={() => jumpToQuestion(idx)}
                                    className={`h-9 w-full rounded-lg text-xs font-bold transition-all border ${
                                        isCurrent ? 'bg-rose-600 border-rose-600 text-white scale-110 shadow-md z-10' :
                                        isFlagged ? 'bg-amber-400 border-amber-400 text-white' :
                                        isAnswered ? 'bg-emerald-100 border-emerald-200 text-emerald-700' :
                                        'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-10 space-y-3 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase">
                            <div className="w-3 h-3 bg-emerald-400 rounded-sm"></div> Answered
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase">
                            <div className="w-3 h-3 bg-amber-400 rounded-sm"></div> Flagged
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase">
                            <div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded-sm"></div> Untouched
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}