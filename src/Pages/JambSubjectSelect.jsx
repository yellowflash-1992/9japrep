import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ExamStateContext } from "../Helpers/Contexts";
import { SUBJECT_META } from "../Helpers/subjectMeta";
import { DIFFICULTIES, fetchTopics } from "../Helpers/questionBank";
import { FaPlus, FaTimes, FaSpinner } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import '../App.css';

const QUESTION_COUNTS = [5, 10, 20, 40];

const DIFFICULTY_META = {
  easy: { label: "Easy", dot: "bg-emerald-500", active: "border-emerald-500 bg-emerald-50 text-emerald-700" },
  medium: { label: "Medium", dot: "bg-amber-500", active: "border-amber-500 bg-amber-50 text-amber-700" },
  hard: { label: "Hard", dot: "bg-rose-500", active: "border-rose-500 bg-rose-50 text-rose-700" },
};

export default function JambSubjectSelect() {
  const {
    selectedSubjects,
    setSelectedSubjects,
    practiceConfig,
    setPracticeConfig,
  } = useContext(ExamStateContext);
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);

  // --- MODE: "mock" (default, unchanged flow) or "practice" (topic drill) ---
  const [mode, setMode] = useState("mock");
  const [practiceSubject, setPracticeSubject] = useState(
    practiceConfig?.subject || "",
  );
  const [topic, setTopic] = useState(practiceConfig?.topic || "");
  const [difficulty, setDifficulty] = useState(practiceConfig?.difficulty || "");
  const [numQuestions, setNumQuestions] = useState(
    practiceConfig?.numQuestions || 10,
  );

  const [topics, setTopics] = useState([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [topicsError, setTopicsError] = useState("");

  const MAX_SUBJECTS = 4;

  // THE FIX: We use a Set to guarantee 'english' is ALWAYS in the array exactly once.
  // If the context is empty [], it becomes ["english"].
  // If the context is ["math", "physics"], it becomes ["english", "math", "physics"].
  // This completely stops the "Ghost English" bug.
  const subjects = Array.from(new Set(["english", ...(selectedSubjects || [])]));

  const selectedWithoutEnglish = subjects.filter(s => s !== "english");

  // We use Math.max to prevent the app from crashing if lengths get weird
  const slots = [
    "english",
    ...selectedWithoutEnglish,
    ...Array(Math.max(0, MAX_SUBJECTS - subjects.length)).fill(null)
  ];

  const handleAddSubject = (id) => {
    // Prevent adding duplicates
    if (subjects.length < MAX_SUBJECTS && !subjects.includes(id)) {
      setSelectedSubjects([...subjects, id]);
      setShowPicker(false);
    }
  };

  // Load topics for the chosen practice subject.
  useEffect(() => {
    let isActive = true;

    if (mode !== "practice" || !practiceSubject) return undefined;

    const loadTopics = async () => {
      setIsLoadingTopics(true);
      setTopicsError("");
      const { data, error } = await fetchTopics({
        examType: "jamb",
        subject: practiceSubject,
      });
      if (!isActive) return;

      if (error) {
        console.error("Failed to load topics:", error);
        setTopicsError("Could not load topics. You can still practise all topics.");
        setTopics([]);
      } else {
        setTopics(data);
      }
      setIsLoadingTopics(false);
    };

    loadTopics();
    return () => {
      isActive = false;
    };
  }, [mode, practiceSubject]);

  const handleSelectPracticeSubject = (id) => {
    setPracticeSubject(id);
    setTopic(""); // topics belong to a subject
    setTopics([]);
    setTopicsError("");
  };

  const handleProceed = () => {
    // --- PRACTICE MODE: same /exam/:subjectId route, practice config attached ---
    if (mode === "practice") {
      if (!practiceSubject) return;

      setPracticeConfig({
        subject: practiceSubject,
        topic,
        difficulty,
        numQuestions,
      });
      navigate(`/exam/${practiceSubject}`);
      return;
    }

    // --- FULL MOCK EXAM: original behaviour, untouched ---
    if (subjects.length === MAX_SUBJECTS) {
      // Sync the cleaned-up array back to context right before moving on
      setSelectedSubjects(subjects);
      navigate("/exam-config");
    }
  };

  const canProceed =
    mode === "practice"
      ? Boolean(practiceSubject)
      : subjects.length === MAX_SUBJECTS;

  const handleOutsideClick = (e) => {
    if (e.target.id === "modalBackdrop") setShowPicker(false);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto min-h-screen">
      {/* Header & Progress */}
      <div className="text-center mb-10">
        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
          Step 1: Subject Selection
        </span>
        <h1 className="text-4xl font-black mt-4 mb-2 text-slate-800">
          Prepare for Success!
        </h1>
        <p className="text-slate-500 max-w-md mx-auto">
          {mode === "practice"
            ? "Drill one subject, one topic, one difficulty at a time."
            : <>English is compulsory. Choose <strong className="text-blue-600">3 additional subjects</strong> to complete your JAMB profile.</>}
        </p>
      </div>

      {/* --- MODE TOGGLE --- */}
      <div className="mx-auto mb-8 flex max-w-md rounded-2xl bg-slate-100 p-1">
        {[
          { id: "mock", label: "Full Mock Exam" },
          { id: "practice", label: "Practice by Topic" },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setMode(option.id)}
            className={`flex-1 rounded-xl px-3 py-2.5 text-xs md:text-sm font-black transition-all ${
              mode === option.id
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {mode === "practice" ? (
        <PracticePanel
          practiceSubject={practiceSubject}
          onSelectSubject={handleSelectPracticeSubject}
          topics={topics}
          isLoadingTopics={isLoadingTopics}
          topicsError={topicsError}
          topic={topic}
          setTopic={setTopic}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          numQuestions={numQuestions}
          setNumQuestions={setNumQuestions}
        />
      ) : (
      <>
      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {slots.map((subjectId, index) => {
          if (subjectId) {
            const meta = SUBJECT_META[subjectId];
            if (!meta) return null; // Safety fallback
            const Icon = meta.icon;

            return (
              <div
                key={index}
                className={`relative p-6 rounded-3xl shadow-lg border-2 border-transparent transition-all duration-300 
                hover:border-blue-400 hover:shadow-2xl group ${meta.bg}`}
              >
                {/* LARGE REMOVE BUTTON */}
                {subjectId !== "english" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // FIX: Filter based on our clean 'subjects' array, not 'prev'
                      setSelectedSubjects(subjects.filter(s => s !== subjectId));
                    }}
                    className="absolute -top-3 -right-3 w-10 h-10 bg-white text-red-500 rounded-full 
                    flex items-center justify-center shadow-xl hover:bg-red-500 hover:text-white 
                    transition-all duration-200 border-2 border-red-100 z-10"
                    title="Remove subject"
                  >
                    <IoMdClose size={24} />
                  </button>
                )}

                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-6 shadow-inner ${meta.color} bg-white/50`}>
                  <Icon size={32} className="group-hover:scale-110 transition-transform" />
                </div>

                <h3 className="font-extrabold text-xl text-slate-800">{meta.name}</h3>
                
                <div className="mt-2">
                  {subjectId === "english" ? (
                    <span className="text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded font-bold uppercase">Compulsory</span>
                  ) : (
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold uppercase">Elective</span>
                  )}
                </div>
              </div>
            );
          }

          {/* Empty Add Slot */}
          return (
            <div
              key={index}
              onClick={() => setShowPicker(true)}
              className="p-8 rounded-3xl border-4 border-dashed border-slate-200 flex flex-col
              items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 
              transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <FaPlus size={24} className="text-slate-400 group-hover:text-blue-500 group-hover:rotate-90 transition-all" />
              </div>
              <p className="font-bold text-slate-400 group-hover:text-blue-500">Add Subject</p>
            </div>
          );
        })}
      </div>

      {/* Picker Modal */}
      {showPicker && (
        <div
          id="modalBackdrop"
          onClick={handleOutsideClick}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-black text-slate-800">Available Subjects</h2>
              <button 
                onClick={() => setShowPicker(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <FaTimes className="text-slate-500" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {Object.entries(SUBJECT_META).map(([id, meta]) => {
                if (subjects.includes(id) || id === "english") return null;
                const Icon = meta.icon;

                return (
                  <div
                    key={id}
                    onClick={() => handleAddSubject(id)}
                    className="flex items-center gap-4 p-4 mb-2 hover:bg-blue-50 rounded-2xl 
                    cursor-pointer transition-all border-2 border-transparent hover:border-blue-100 group"
                  >
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${meta.color} bg-white shadow-sm`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{meta.name}</p>
                      <p className="text-xs text-slate-400">Click to add to your list</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      </>
      )}

      {/* Proceed Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleProceed}
          disabled={!canProceed}
          className={`group relative px-4 py-2 md:px-8 md:py-3 rounded-2xl 
            font-black text-sm md:text-lg shadow-xl transition-all active:scale-95 ${
            canProceed
              ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200"
              : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          {mode === "practice"
            ? practiceSubject
              ? "Start Practice →"
              : "Select a Subject to Practise"
            : subjects.length === MAX_SUBJECTS
              ? "Generate Jamb Exam →"
              : `Select ${MAX_SUBJECTS - subjects.length} More to Start`}
        </button>
        <p className="mt-4 text-sm text-slate-400 font-medium italic">
          {mode === "practice"
            ? practiceSubject
              ? `${SUBJECT_META[practiceSubject]?.name || practiceSubject} · ${topic || "All topics"} · ${difficulty || "Mixed"} · ${numQuestions} questions`
              : "Practice mode uses a single subject"
            : `Total Selected: ${subjects.length} / ${MAX_SUBJECTS}`}
        </p>
      </div>
    </div>
  );
}

function PracticePanel({
  practiceSubject,
  onSelectSubject,
  topics,
  isLoadingTopics,
  topicsError,
  topic,
  setTopic,
  difficulty,
  setDifficulty,
  numQuestions,
  setNumQuestions,
}) {
  return (
    <div className="space-y-6">
      {/* 1. Subject */}
      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
          1. Subject
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {Object.entries(SUBJECT_META).map(([id, meta]) => {
            const Icon = meta.icon;
            const isActive = practiceSubject === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectSubject(id)}
                className={`flex items-center gap-2 rounded-2xl border-2 px-3 py-2.5 text-left transition-all active:scale-[0.98] ${
                  isActive
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${meta.bg} ${meta.color}`}>
                  <Icon size={14} />
                </span>
                <span className={`truncate text-xs font-bold ${isActive ? "text-blue-700" : "text-slate-600"}`}>
                  {meta.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Topic */}
      <section className={`rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6 ${practiceSubject ? "" : "pointer-events-none opacity-50"}`}>
        <h2 className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400">
          2. Topic
        </h2>
        <p className="mb-4 text-xs text-slate-400">
          {practiceSubject ? "Leave on “All topics” for a mixed drill." : "Choose a subject first."}
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTopic("")}
            className={`rounded-full border-2 px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
              !topic
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
            }`}
          >
            All topics
          </button>

          {isLoadingTopics &&
            [1, 2, 3].map((key) => (
              <span key={key} className="h-9 w-24 animate-pulse rounded-full bg-slate-100" />
            ))}

          {!isLoadingTopics &&
            topics.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTopic(item)}
                className={`rounded-full border-2 px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                  topic === item
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
        </div>

        {isLoadingTopics && (
          <p className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-400">
            <FaSpinner className="animate-spin" /> Loading topics…
          </p>
        )}

        {!isLoadingTopics && topicsError && (
          <p className="mt-3 text-xs font-medium text-amber-600">{topicsError}</p>
        )}

        {!isLoadingTopics && practiceSubject && !topicsError && topics.length === 0 && (
          <p className="mt-3 text-xs font-medium text-slate-400">
            No topics tagged for this subject yet — you will get a mixed drill.
          </p>
        )}
      </section>

      {/* 3. Difficulty */}
      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
          3. Difficulty
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => setDifficulty("")}
            className={`rounded-2xl border-2 px-3 py-3 text-left transition-all active:scale-[0.98] ${
              difficulty === ""
                ? "border-blue-600 bg-blue-50"
                : "border-slate-100 hover:border-slate-200"
            }`}
          >
            <span className="block text-sm font-black text-slate-700">Mixed</span>
            <span className="block text-[10px] font-medium text-slate-400">All levels</span>
          </button>

          {DIFFICULTIES.map((level) => {
            const meta = DIFFICULTY_META[level];
            const isActive = difficulty === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`rounded-2xl border-2 px-3 py-3 text-left transition-all active:scale-[0.98] ${
                  isActive ? meta.active : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <span className="flex items-center gap-1.5 text-sm font-black">
                  <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Question count */}
      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
          4. Questions
        </h2>
        <div className="flex flex-wrap gap-2">
          {QUESTION_COUNTS.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setNumQuestions(count)}
              className={`min-w-16 rounded-xl border-2 px-4 py-2 text-sm font-black transition-all active:scale-95 ${
                numQuestions === count
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-100 text-slate-600 hover:border-slate-200"
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}