import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExamStateContext } from "../Helpers/Contexts";
import { FaArrowLeft, FaRunning, FaGraduationCap, FaClock } from "react-icons/fa";

function JambExamConfig() {
  const { config, setConfig, selectedSubjects } = useContext(ExamStateContext);
  const navigate = useNavigate();
  
  // Sync initial state with context duration
  const [selectedMode, setSelectedMode] = useState(config.duration === 120 ? 'full' : 'practice');

  const modes = [
    { 
      id: 'practice', 
      label: 'Short Test (35 mins)', 
      duration: 35, 
      description: 'Perfect for a quick session. Focuses on speed and accuracy.',
      icon: <FaRunning size={24} />,
      color: 'blue'
    },
    { 
      id: 'full', 
      label: 'Full Test Mode', 
      duration: 120, 
      description: 'The standard JAMB experience. Simulates the real exam environment.',
      icon: <FaGraduationCap size={24} />,
      color: 'purple'
    },
  ];

  const handleSelectMode = (mode) => {
    setSelectedMode(mode.id);
    setConfig(prev => ({ ...prev, duration: mode.duration }));
  };

  const handleProceed = () => {
    navigate('/exam-menu');
  };

  const electives = selectedSubjects.filter(s => s !== "english");
  const hasEnglish = selectedSubjects.includes("english");

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen">
      
      {/* Back Button & Header Area */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
        <button 
          onClick={() => navigate(-1)} // Goes back to subject selection
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors"
        >
          <FaArrowLeft /> Back to Subjects
        </button>

        {/* RESPONSIVE SUBJECTS LIST */}
        <div className="w-full md:w-auto bg-slate-50 md:bg-transparent p-5 md:p-0 rounded-4xl md:rounded-none">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-3 md:mb-1 md:text-right">
            Selected Subjects
          </p>
          
          <div className="flex flex-col md:flex-row md:items-center justify-end gap-3 md:gap-2 text-sm font-bold text-slate-700 capitalize">
            
            {/* English (Separated from the column) */}
            {hasEnglish && (
              <div className="text-blue-700 bg-blue-100/50 md:bg-transparent px-3 py-2 md:p-0 rounded-xl flex items-center md:inline-flex w-fit">
                English 
                <span className="text-[9px] uppercase bg-blue-200/50 text-blue-600 px-1.5 py-0.5 rounded ml-2 md:hidden">
                  Compulsory
                </span>
              </div>
            )}
            
            {/* Divider visible only on desktop */}
            {hasEnglish && electives.length > 0 && (
              <span className="hidden md:block text-slate-300">|</span>
            )}

            {/* Electives: 1 Column on Mobile, Inline Row on Desktop */}
            <ul className="flex flex-col md:flex-row gap-2 md:gap-3 md:items-center mt-1 md:mt-0 w-full md:w-auto">
              {electives.map((sub, index) => (
                <li 
                  key={sub} 
                  className="flex items-center gap-3 bg-white md:bg-transparent px-4 py-2.5 md:p-0 rounded-xl shadow-sm border border-slate-100 md:border-none md:shadow-none"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-200 md:hidden"></span>
                  {sub}
                  {/* Desktop bullet separator */}
                  {index < electives.length - 1 && (
                    <span className="hidden md:inline text-slate-300 ml-3">•</span>
                  )}
                </li>
              ))}
            </ul>

          </div>
        </div>
      </div>

      <div className="text-center mb-12 mt-4">
        <h1 className="text-3xl font-black text-slate-800 mb-2">Select Test Mode</h1>
        <p className="text-slate-500">Choose how you want to challenge yourself today.</p>
      </div>

      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {modes.map((mode) => (
          <div
            key={mode.id}
            onClick={() => handleSelectMode(mode)}
            className={`relative p-8 rounded-3xl border-4 cursor-pointer transition-all duration-300 flex flex-col justify-between
              ${selectedMode === mode.id 
                ? 'border-blue-600 bg-blue-50/30 shadow-2xl scale-[1.02]' 
                : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg'}
            `}
          >
            {/* Selection Checkmark */}
            {selectedMode === mode.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}

            <div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 
                ${selectedMode === mode.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {mode.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-3">{mode.label}</h3>
              <p className="text-slate-500 leading-relaxed mb-8">
                {mode.description}
              </p>
            </div>

            {/* THE TIME BOX (Requested Box below description) */}
            <div className={`flex items-center justify-center gap-3 p-4 rounded-2xl transition-colors
              ${selectedMode === mode.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 text-slate-400'}`}>
              <FaClock />
              <span className="text-xl font-black">{mode.duration}</span>
              <span className="text-sm font-bold uppercase tracking-wide">Minutes</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Area */}
      <div className="mt-16 bg-slate-900 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="text-center md:text-left">
          <h4 className="text-white font-bold text-lg">Ready to begin?</h4>
          <p className="text-slate-400 text-sm">You are attempting {selectedSubjects.length} subjects in {config.duration} minutes.</p>
        </div>
        
        <button
          onClick={handleProceed}
          className="w-full md:w-auto px-4 py-2 md:px-8 md:py- rounded-2xl bg-blue-500
           text-white font-black text-sm md:text-lg hover:bg-blue-400 shadow-lg shadow-blue-900/20 
           active:scale-95 transition-all"
        >
          Confirm Settings
        </button>
      </div>

      {/* Footer hint */}
      <p className="text-center mt-6 text-slate-400 text-xs font-medium">
        Ensure your device is charged and you are in a quiet environment.
      </p>
    </div>
  );
}

export default JambExamConfig;