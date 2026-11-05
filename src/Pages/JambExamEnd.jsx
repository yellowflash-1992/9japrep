import { useContext, useEffect, useMemo } from "react";
import { ExamStateContext } from "../Helpers/Contexts";
import { useNavigate } from "react-router-dom";
import MasterResultChart from '../Components/MasterResultChart';
import SubjectRow from "../Components/ResultSubjectRow";
import SubjectComparisonChart from "../Components/JambSubCompChart";

export default function JambExamEnd() {
  const { 
    score, 
    selectedSubjects, 
    detailedResults, 
    setScore, 
    setDetailedResults, 
    setReviewData 
  } = useContext(ExamStateContext);
  
  const navigate = useNavigate();

  // 1. Recovery Logic for Refreshing the Page
  useEffect(() => {
    const isStateEmpty = !score && Object.keys(detailedResults.breakdown || {}).length === 0;
    if (isStateEmpty) {
      const saved = localStorage.getItem("last_exam_results");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.score !== undefined) setScore(parsed.score);
          if (parsed.results) setDetailedResults(parsed.results);
          if (parsed.review) setReviewData(parsed.review);
        } catch (e) { console.error("Recovery failed", e); }
      }
    }
  }, [score, detailedResults, setScore, setDetailedResults, setReviewData]);

  // 2. Calculations
  const trueTotal = useMemo(() => {
    return Object.values(detailedResults.totals || {}).reduce((a, b) => a + b, 0) || 0;
  }, [detailedResults.totals]);

  const accuracy = trueTotal > 0 ? ((score / trueTotal) * 100).toFixed(1) : 0;

  return (
    <div className="w-full max-w-5xl min-w-0 mx-auto overflow-x-hidden p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION: Title and Accuracy Cards */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Exam Analysis</h1>
          <p className="text-slate-500 font-medium">Detailed performance report for your last session.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex-1 md:flex-none">
              <p className="text-emerald-600 text-[10px] font-black uppercase tracking-wider">Accuracy</p>
              <p className="text-xl font-black text-emerald-700">{accuracy}%</p>
           </div>
           <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 flex-1 md:flex-none">
              <p className="text-blue-600 text-[10px] font-black uppercase tracking-wider">Total Score</p>
              <p className="text-xl font-black text-blue-700">{score}/{trueTotal}</p>
           </div>
        </div>
      </div>

      {/* VISUAL ANALYSIS SECTION: Charts Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Overall Doughnut */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Overall Performance</h3>
          <div className="w-full max-w-50">
            <MasterResultChart score={score} total={trueTotal} />
          </div>
        </div>

        {/* Right: Subject Strength Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Strength by Subject</h3>
          <div className="w-full h-[250px] md:h-[350px]">
            <SubjectComparisonChart 
                detailedResults={detailedResults} 
                selectedSubjects={selectedSubjects} 
            />
          </div>
        </div>
      </div>

      {/* DETAILED BREAKDOWN: List of Subjects */}
      <div className="w-full max-w-full min-w-0 overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-100 p-4 md:p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Subject Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          {selectedSubjects.map((sub) => {
             const key = sub.toLowerCase().includes("english") ? "english" : sub.toLowerCase().split(" ")[0];
             return (
               <SubjectRow 
                 key={key}
                 subject={sub}
                 score={detailedResults.breakdown?.[key] || 0}
                 total={detailedResults.totals?.[key] || 0}
               />
             )
          })}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 py-6">
        <button 
          onClick={() => navigate("/exam-review")} 
          className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-amber-200 active:scale-95"
        >
          View Corrections
        </button>
        <button 
          onClick={() => navigate("/select-subject")} 
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          Take Another Exam
        </button>
        <button 
          onClick={() => navigate("/")} 
          className="w-full md:w-auto bg-slate-100 hover:bg-slate-200 text-slate-600 px-10 py-4 rounded-2xl font-bold transition-all active:scale-95"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}