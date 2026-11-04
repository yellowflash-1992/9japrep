import React, { useContext, useState } from 'react';
import { ExamStateContext } from '../Helpers/Contexts';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaInfoCircle, FaFlag, FaMousePointer, FaLayerGroup, FaClock } from 'react-icons/fa';
import InstructionModal from '../Components/JambSummaryModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../Hooks/useAuth';

function JambExamMenu() {
  const { userName, selectedSubjects, config } = useContext(ExamStateContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic Logic for Instruction Counts
  const isFullTest = config.duration === 120;
  const englishCount = isFullTest ? 20 : 10;
  const otherCount = isFullTest ? 10 : 5;
  const totalQuestions = englishCount + (otherCount * (selectedSubjects.length - 1));

  const handleProceedToStart = () => {
    if (selectedSubjects.length === 0) {
      navigate('/select-subject');
      return;
    }
    setIsModalOpen(true);
  };

  const confirmAndStart = async () => {
  if (selectedSubjects.length === 0) {
    navigate('/select-subject');
    return;
  }

  if (!user) {
    alert("Failed to start exam securely. Please log in again.");
    return;
  }

  const { data, error } = await supabase.from('attempts').insert({
    user_id: user.id,
    exam_type: 'jamb',
    subjects: selectedSubjects,
    status: 'in_progress'
  }).select('id').single();

  if (error) {
    alert("Failed to start exam securely. Please log in again.");
    console.error(error);
    return;
  }

  setIsModalOpen(false);

  // 1. Setup a clean session
  // We save the TOTAL minutes and the current timeLeft in seconds
  const sessionData = {
    attemptId: data.id,
    userName: userName,
    startTime: new Date().toISOString(),
    totalDuration: config.duration, // original setting (e.g., 120)
    timeLeft: config.duration * 60, // countdown start (e.g., 7200)
    config: config // backup of the question counts
  };
  
  localStorage.setItem('jamb_exam_session', JSON.stringify(sessionData));

  // 2. Clear any leftover subject data from a previous attempt
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith("jamb_exam_session_")) {
      localStorage.removeItem(key);
    }
  });

  // 3. Navigation
  if (selectedSubjects && selectedSubjects.length > 0) {
    const firstSubjectRaw = selectedSubjects[0].toLowerCase();
    let firstSubjectSlug = firstSubjectRaw.includes("english") 
      ? "english" 
      : firstSubjectRaw.split(" ")[0];

    navigate(`/exam/${firstSubjectSlug}`);
  }
};

 return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto min-h-screen flex flex-col">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6 md:mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all text-sm md:text-base"
        >
          <FaArrowLeft /> <span className="hidden xs:inline">Back to Settings</span>
        </button>
        <div className="bg-blue-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-blue-100 shadow-sm">
          <p className="text-[9px] md:text-[10px] text-blue-400 font-black uppercase tracking-widest leading-none mb-1">Candidate ID</p>
          <p className="text-xs md:text-sm font-bold text-blue-700 truncate max-w-30 md:max-w-none">
            {userName || "JAMB-CBT-USER"}
          </p>
        </div>
      </div>

      {/* Main Instruction Card */}
      <div className="bg-white rounded-4xl md:rounded-3xl shadow-xl md:shadow-2xl border border-slate-100 overflow-hidden flex-grow">
        
        {/* Professional Header Area */}
        <div className="bg-slate-900 p-6 md:p-8 text-white">
          <div className="flex items-center gap-3 md:gap-4 mb-2">
            <div className="bg-blue-500 p-2 md:p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <FaInfoCircle size={20} className="md:w-6 md:h-6" />
            </div>
            <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight">CBT Instructions</h1>
          </div>
          <p className="text-slate-400 text-xs md:text-base font-medium">Please read the rules carefully before starting.</p>
        </div>

        <div className="p-5 md:p-8">
          
          {/* 1. The Exam Structure Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
            <div className="bg-blue-50 p-4 md:p-6 rounded-2xl border-l-4 border-blue-500">
              <h3 className="font-black text-blue-900 text-sm md:text-base mb-1">Question Distribution</h3>
              <p className="text-xs md:text-sm text-blue-700 leading-relaxed">
                You will be given <span className="font-bold">{englishCount} questions</span> for English Language 
                and <span className="font-bold">{otherCount} questions</span> for each other subject.
              </p>
            </div>
            <div className="bg-amber-50 p-4 md:p-6 rounded-2xl border-l-4 border-amber-500">
              <h3 className="font-black text-amber-900 text-sm md:text-base mb-1">
                {isFullTest ? "Full JAMB Simulation" : "Quick Practice"}
              </h3>
              <p className="text-xs md:text-sm text-amber-700 leading-relaxed">
                Total: <span className="font-bold text-base">{config.duration} mins</span> for 
                <span className="font-bold text-base"> {totalQuestions} questions</span>.
                <span className="block mt-1 text-[9px] md:text-[10px] opacity-75 italic">*Timer persists on refresh.</span>
              </p>
            </div>
          </div>

          {/* 2. CBT Navigation Guide */}
          <h2 className="text-lg md:text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <FaMousePointer className="text-blue-500" size={16}/> Navigation & Controls
          </h2>

          <div className="space-y-6 md:space-y-8">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 shadow-sm">
                <FaLayerGroup size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-700 text-sm md:text-base">Subject Switching</h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-0.5">Use tabs at the top to switch subjects. Answer in any order.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 shadow-sm">
                <FaFlag size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-700 text-sm md:text-base">Flag for Review</h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-0.5">Click 'Flag' to mark difficult questions; they turn purple on the palette.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 shadow-sm">
                <FaClock size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-700 text-sm md:text-base">Automatic Submission</h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-0.5">System auto-saves and submits when the timer reaches 00:00.</p>
              </div>
            </div>
          </div>

          {/* Bottom Action Section */}
          <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-slate-100 flex flex-col items-center">
             <button 
              onClick={handleProceedToStart}
              className="w-full md:w-70 h-10 md:h-12 bg-blue-600 hover:bg-blue-700
               text-white rounded-2xl font-black text-sm md:text-xl shadow-xl
                shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              PROCEED TO START
            </button>
            <p className="mt-4 text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest">
              Ready to test your knowledge?
            </p>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <p className="text-center mt-6 md:mt-8 text-slate-400 text-[10px] md:text-[11px] leading-tight px-4 md:px-10 pb-6">
        Disclaimer: This is a simulation designed for JAMB preparation. familiarize yourself with these instructions to maximize your score.
      </p>

      <InstructionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmAndStart}
        config={config}
        subjects={selectedSubjects}
        instruction={`Mode: ${isFullTest ? 'Full Exam' : 'Quick Practice'} | Questions: ${totalQuestions}`}
      />
    </div>
  );
}

export default JambExamMenu;