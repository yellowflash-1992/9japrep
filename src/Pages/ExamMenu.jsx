import React, { useContext } from 'react';
import { ExamStateContext, MIN_WAEC_QUESTIONS } from '../Helpers/Contexts';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../Hooks/useAuth';
import { 
    FaUserCircle, 
    FaClock, 
    FaCheckCircle, 
    FaArrowLeft, 
    FaPlay, 
    FaInfoCircle, 
    FaQuestionCircle 
} from 'react-icons/fa';

function ExamMenu() {
    // Note: Ensure your Context provides 'waecUserName' if you're using the separate WAEC login
    const { waecUserName, waecSelectedSubjects, waecConfig } = useContext(ExamStateContext);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Determine which name to show (fallback to JAMB name if WAEC name isn't set)
    const displayName = waecUserName || waecUserName || "Guest Candidate";

   const handleBeginExam = async () => {
        if (waecSelectedSubjects.length === 0) {
            alert("No subjects selected! Please go back.");
            navigate('/new-select-subject');
            return;
        }

        if (!user) {
            alert("Failed to start exam securely.");
            console.error("Cannot start exam without an authenticated user.");
            return;
        }

        Object.keys(localStorage).forEach(key => {
            if (
                key.startsWith('waec_exam_session')
                || key.startsWith('waec_progress')
                || key.startsWith('neco_exam_session')
                || key.startsWith('neco_progress')
                || key === 'waec_exam_completed'
            ) {
                localStorage.removeItem(key);
            }
        });

        const { data, error } = await supabase.from('attempts').insert({
            user_id: user.id,
            exam_type: waecConfig.examType === 'neco' ? 'neco' : 'waec',
            subjects: waecSelectedSubjects,
            status: 'in_progress'
        }).select('id').single();

        if (error) {
            alert("Failed to start exam securely. Check console for details.");
            console.error(error);
            return;
        }

        const sessionData = {
            attemptId: data.id,
            userName: displayName,
            examType: waecConfig.examType || 'waec',
            startTime: new Date().toISOString(),
            timeLeft: (waecConfig.duration || 45) * 60,
            subjects: waecSelectedSubjects,
            config: waecConfig
        };
        
        localStorage.setItem('waec_exam_session', JSON.stringify(sessionData));
        
        // FIX: Changed waecSelectedSubjects to selectedSubjects
       const firstSubjectId = waecSelectedSubjects[0].toLowerCase().split(" ")[0];
    navigate(`/new-exam-page/${firstSubjectId}`);
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] p-4 bg-slate-50/50">
            <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl border border-rose-100 overflow-hidden transition-all">
                
                {/* Header: Admission Slip Style */}
                <div className="bg-rose-600 p-8 text-white relative">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <FaUserCircle size={80} className="text-rose-100/50 bg-rose-700 rounded-full" />
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-rose-600 rounded-full"></div>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-black tracking-tight uppercase">Exam Admission Slip</h2>
                            <p className="text-rose-100 font-medium opacity-90 flex items-center justify-center md:justify-start gap-2">
                                <span className="bg-rose-700 px-3 py-0.5 rounded-full text-xs font-bold uppercase">
                                    {waecConfig.examType || 'WAEC'} 2026
                                </span>
                                {displayName}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Summary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100">
                            <label className="text-[10px] font-black uppercase text-rose-400 block mb-2 tracking-widest">Duration</label>
                            <div className="flex items-center gap-3 text-rose-700">
                                <FaClock />
                                <span className="text-xl font-bold">{waecConfig.duration} Mins</span>
                            </div>
                        </div>

                        <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100">
                            <label className="text-[10px] font-black uppercase text-rose-400 block mb-2 tracking-widest">Total Items</label>
                            <div className="flex items-center gap-3 text-rose-700">
                                <FaQuestionCircle />
                                <span className="text-xl font-bold">
                                    {waecSelectedSubjects.length * (waecConfig.numQuestions || MIN_WAEC_QUESTIONS)} Qs
                                </span>
                            </div>
                        </div>

                        <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100">
                            <label className="text-[10px] font-black uppercase text-rose-400 block mb-2 tracking-widest">Status</label>
                            <div className="flex items-center gap-3 text-emerald-600">
                                <FaCheckCircle />
                                <span className="text-xl font-bold italic">Ready</span>
                            </div>
                        </div>
                    </div>

                    {/* Subject Breakdown */}
                    <div className="mb-8 text-center">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            Registered Subjects
                        </h4>
                        <div className="flex flex-wrap gap-2 justify-center">
    {waecSelectedSubjects.map((subId, idx) => (
        <span key={idx} className="bg-white border-2 border-rose-100 text-rose-600 px-5 py-2 rounded-xl font-bold text-sm shadow-sm uppercase">
            {subId} {/* This will now correctly link to your question bank keys */}
        </span>
    ))}
</div>
                    </div>

                    {/* Instructions Box */}
                    <div className="bg-slate-800 rounded-2xl p-6 text-slate-300 mb-8">
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <FaInfoCircle className="text-rose-400" /> Proctor Instructions
                        </h3>
                        <ul className="text-sm space-y-2 opacity-90">
                            <li className="flex gap-2">
                                <span className="text-rose-400 font-bold">•</span>
                                Clicking "Begin" starts the non-stoppable countdown.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-rose-400 font-bold">•</span>
                                Use the sidebar to toggle between your {waecSelectedSubjects.length} subjects.
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <button 
                            onClick={() => navigate('/new-exam-config')}
                            className="flex-1 h-14 border-2 border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            <FaArrowLeft size={14} /> Back
                        </button>

                        <button 
                            onClick={handleBeginExam}
                            className="w-full md:w-auto px-6 py-2 text-sm md:text-base font-semibold rounded-lg bg-rose-600 hover:bg-rose-700
                             text-white shadow-xl shadow-rose-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <FaPlay size={14} /> BEGIN EXAMINATION
                        </button>
                    </div>
                </div>
            </div>
            
            <p className="mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                WAEC Computer Based Test Replica v3.0
            </p>
        </div>
    );
}

export default ExamMenu;