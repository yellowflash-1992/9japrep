import { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ExamStateContext, MIN_WAEC_QUESTIONS } from "../Helpers/Contexts";
import { FaClock, FaClipboardList, FaLayerGroup, FaChevronLeft } from 'react-icons/fa';

const QUESTION_COUNTS = [2, 5, 10];

function ExamConfig() {
     const { waecConfig, setWaecConfig, waecSelectedSubjects } = useContext(ExamStateContext);
    const navigate = useNavigate();

    useEffect(() => {
        const numQuestions = Number(waecConfig.numQuestions);
        if (!QUESTION_COUNTS.includes(numQuestions) || !waecConfig.duration) {
            setWaecConfig(prev => ({
                ...prev,
                numQuestions: QUESTION_COUNTS.includes(Number(prev.numQuestions))
                    ? Number(prev.numQuestions)
                    : MIN_WAEC_QUESTIONS,
                duration: prev.duration || 45,       // Default to 45 mins
                examType: prev.examType || "waec"
            }));
        }
    }, [waecConfig, setWaecConfig]);

    const handleChange = (e) => {
    const { name, value } = e.target;
    const val = (name === "duration" || name === "numQuestions") ? parseInt(value) : value;
    setWaecConfig(prev => ({ ...prev, [name]: val }));
  };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                
                {/* Header Section */}
                <div className="bg-rose-600 p-8 text-white relative">
                    <button 
                        onClick={() => navigate('/new-select-subject')}
                        className="absolute top-4 left-4 hover:bg-rose-700 p-2 rounded-full transition-colors"
                    >
                        <FaChevronLeft size={18} />
                    </button>
                    <h2 className="text-2xl font-bold text-center">Exam Configuration</h2>
                    <p className="text-rose-100 text-center text-sm mt-2 opacity-90">
                        Customizing session for: <br/>
                        <span className="font-semibold text-white uppercase tracking-wider">
                            {waecSelectedSubjects.length > 0 ? waecSelectedSubjects.join(" & ") : "No Subjects Selected"}
                        </span>
                    </p>
                </div>

                <div className="p-8 space-y-8">
                    
                    {/* 1. Exam Type Dropdown */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-slate-700 font-bold text-sm uppercase tracking-wide">
                            <FaLayerGroup className="text-rose-500" /> Exam Category
                        </label>
                        <select
                            name="examType"
                            value={waecConfig.examType || "waec"}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-rose-500 focus:ring-0 outline-none transition-all cursor-pointer font-medium text-slate-700"
                        >
                            <option value="waec">WAEC (West African Senior School Certificate)</option>
                            <option value="neco">NECO (National Examinations Council)</option>
                        </select>
                    </div>

                    {/* 2. Test Duration Dropdown */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-slate-700 font-bold text-sm uppercase tracking-wide">
                            <FaClock className="text-rose-500" /> Session Duration
                        </label>
                        <select
                            name="duration"
                            value={waecConfig.duration}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-rose-500 focus:ring-0 outline-none transition-all cursor-pointer font-medium text-slate-700"
                        >
                            <option value={35}>35 Minutes (Fast Practice)</option>
                            <option value={45}>45 Minutes (Standard)</option>
                            <option value={60}>1 Hour (Intensive)</option>
                            <option value={120}>2 Hours (Full Mock)</option>
                        </select>
                    </div>

                    {/* 3. No. of Questions Dropdown */}
                   {/* Questions Per Subject - The "Rhyme" */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-slate-700 font-bold text-sm uppercase tracking-wide">
                            <FaClipboardList className="text-rose-500" /> Questions Per Subject
                        </label>
                        <select
                            name="numQuestions"
                            value={waecConfig.numQuestions || MIN_WAEC_QUESTIONS}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-rose-500 outline-none font-medium text-slate-700"
                        >
                            {QUESTION_COUNTS.map(num => (
                                <option key={num} value={num}>{num} {num === 1 ? 'Question' : 'Questions'}</option>
                            ))}
                        </select>
                        <p className="text-[11px] text-slate-400 italic">
                        This will apply to all {waecSelectedSubjects.length} selected subjects.</p>
                    </div>

                    {/* Proceed Button */}
                    <button
                        onClick={() => navigate('/new-exam-menu')}
                        className="w-full md:w-auto px-8 py-2.5 text-sm md:text-base font-bold rounded-xl bg-rose-600 text-white
                        hover:bg-rose-700 active:scale-[0.98] transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-2"
                    >
                        Confirm & Start Exam
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ExamConfig;