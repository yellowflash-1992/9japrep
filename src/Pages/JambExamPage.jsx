import { useContext } from "react";
import {
  FaCheckDouble,
  FaChevronLeft,
  FaChevronRight,
  FaFlag,
} from "react-icons/fa";
import { NavLink, useNavigate, useParams, Link } from "react-router-dom";
import "../App.css";
import QuestionCard from "../Components/JambQuestionCard";
import QuestionNavigator from "../Components/JambQuestionNavigator";
import ProgressBar from "../Components/ProgressBar";
import Timer from "../Components/Timer";
import { ExamStateContext } from "../Helpers/Contexts";
import { toSentenceCase } from "../Helpers/stringUtils";
import { useExam } from "../Hooks/jambUseExamLogic";

export default function JambExamPage() {
  const { selectedSubjects } = useContext(ExamStateContext);
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const {
    userName,
    config,
    questions,
    question,
    currentQuestion,
    selectedOption,
    answers,
    flagged,
    isLoading,
    loadError,
    chooseOption,
    nextQuestion,
    finishExam,
    jumpToQuestion,
    toggleFlag,
    isLastSubject,
    isPremium,
  } = useExam(subjectId);

  const getButtonText = () => {
    if (currentQuestion < questions.length - 1) return "Next Question";
    if (!isLastSubject) return "Next Subject";
    return "Submit Exam";
  };

  const tabSubjects =
    selectedSubjects?.map((sub) => {
      const id = sub.toLowerCase().includes("english")
        ? "english"
        : sub.toLowerCase().split(" ")[0];
      return { id, name: sub };
    }) || [];

  const handleQuit = () => {
    if (
      window.confirm("Are you sure you want to quit? progress may be lost.")
    ) {
      navigate("/");
    }
  };

  if (!isLoading && (!questions || questions.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-slate-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 max-w-md">
          <h2 className="text-2xl font-black text-slate-800 mb-2">
            {loadError ? "Unable to Load Questions" : "Subject Locked"}
          </h2>
          <p className="text-slate-500 mb-6">
            {loadError || `Questions for "${toSentenceCase(subjectId)}" are currently being updated.`}
          </p>
          <NavLink
            to="/exam-config"
            className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-bold"
          >
            Return to Setup
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 md:pb-8">
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="hidden md:block">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
              Candidate
            </p>
            <h2 className="text-sm font-bold text-slate-700">
              {toSentenceCase(userName)}
            </h2>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 overflow-x-auto no-scrollbar">
            {tabSubjects.map((sub) => (
              <NavLink
                key={sub.id}
                to={`/exam/${sub.id}`}
                className={({ isActive }) =>
                  `px-3 md:px-4 py-1.5 rounded-lg text-[11px] md:text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`
                }
              >
                {toSentenceCase(sub.id)}
              </NavLink>
            ))}
          </div>

          <Timer
            duration={config.duration}
            onTimeUp={finishExam}
            storageKey="jamb_exam_session"
          />
        </div>
      </nav>

      {!isPremium && (
        <div className="max-w-7xl mx-auto mt-4 px-4">
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-amber-800">
              You are on the Free Plan (10 questions). Unlock all 40 questions for ₦2,000.
            </p>
            <Link
              to="/dashboard"
              className="inline-block text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg"
            >
              Upgrade
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-4">
        {/* PROGRESS HEADER */}
        {/* RESTRUCTURED PROGRESS & BUTTONS HEADER */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
            {/* 1. LEFT: Subject Title */}
            <div className="shrink-0">
              <h1 className="text-xl md:text-2xl font-black text-slate-800 capitalize leading-tight">
                {subjectId} Section
              </h1>
              <p className="text-slate-400 text-xs md:text-sm font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>

            {/* 2. MIDDLE: Progress Bar (Desktop Only) */}
            <div className="hidden md:block flex-1 max-w-md w-full">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Subject Progress
                </span>
                <span className="text-[9px] font-bold text-indigo-600">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}
                  %
                </span>
              </div>
              <ProgressBar
                current={currentQuestion + 1}
                total={questions.length}
              />
            </div>

            {/* 3. RIGHT: Action Buttons */}
            <div className="w-full md:w-auto shrink-0">
              {/* MOBILE ONLY: Buttons appear below the title */}
              <div className="flex md:hidden gap-2 w-full">
                <button
                  onClick={handleQuit}
                  className="flex-1 bg-rose-50 text-rose-600 py-3 rounded-xl font-bold text-xs border border-rose-100 uppercase tracking-wider"
                >
                  Quit Exam
                </button>
                <button
                  onClick={finishExam}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-100"
                >
                  Submit Exam
                </button>
              </div>

              {/* DESKTOP ONLY: Quit/Submit Buttons */}
              <div className="hidden md:flex gap-3">
                <button
                  onClick={handleQuit}
                  className="px-6 py-2.5 bg-white text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  Quit
                </button>
                <button
                  onClick={finishExam}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT: QUESTION AREA */}
          <div className="flex-1 w-full">
            <div className="bg-white rounded-4xl md:rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all">
              <div className="bg-slate-50/50 border-b border-slate-100 p-4 md:p-5 flex justify-between items-center">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  JAMB Standard
                </span>
                <button
                  onClick={toggleFlag}
                  className={`text-xs md:text-sm font-bold flex items-center gap-2 transition-colors ${flagged.includes(currentQuestion) ? "text-amber-500" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <FaFlag />{" "}
                  {flagged.includes(currentQuestion)
                    ? "Flagged"
                    : "Flag for Review"}
                </button>
              </div>

              <div className="p-6 md:p-10 flex-1 min-h-75">
                {question ? (
                  <QuestionCard
                    question={question}
                    selectedOption={selectedOption}
                    chooseOption={chooseOption}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold">
                      Loading Question...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: SIDEBAR (Question Palette + Buttons) */}
          <aside className="w-full lg:w-80 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white p-6 rounded-4xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FaCheckDouble /> Question Palette
              </h3>

              <div className="max-h-70 overflow-y-auto pr-2 custom-scrollbar mb-6">
                <QuestionNavigator
                  total={questions.length}
                  current={currentQuestion}
                  answers={answers}
                  flagged={flagged}
                  jumpToQuestion={jumpToQuestion}
                />
              </div>

              {/* NAVIGATION BUTTONS (DESKTOP ONLY) */}
              <div className="hidden lg:flex flex-col gap-3 pt-6 border-t border-slate-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => jumpToQuestion(currentQuestion - 1)}
                    disabled={currentQuestion === 0}
                    className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-sm disabled:opacity-30 transition-all hover:bg-slate-200"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextQuestion}
                    className={`flex-2 py-3 rounded-xl font-black text-sm text-white transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      currentQuestion === questions.length - 1 && isLastSubject
                        ? "bg-emerald-600 animate-pulse"
                        : "bg-indigo-600"
                    }`}
                  >
                    {getButtonText()} <FaChevronRight size={10} />
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-sm"></div>{" "}
                  Answered
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-amber-400 rounded-sm"></div>{" "}
                  Flagged
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM NAVIGATION */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 px-6 z-50 flex justify-between items-center shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => jumpToQuestion(currentQuestion - 1)}
          disabled={currentQuestion === 0}
          className={`flex items-center gap-2 font-bold text-sm ${currentQuestion === 0 ? "text-slate-200" : "text-slate-500"}`}
        >
          <FaChevronLeft /> Prev
        </button>

        <button
          onClick={nextQuestion}
          className={`px-8 py-3 rounded-xl font-black text-sm text-white shadow-lg transition-all active:scale-95 ${
            currentQuestion === questions.length - 1 && isLastSubject
              ? "bg-emerald-600 shadow-emerald-100"
              : "bg-indigo-600 shadow-indigo-100"
          }`}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}
