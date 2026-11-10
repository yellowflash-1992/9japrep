import React from 'react';
import { difficultyStyles } from '../Helpers/questionBank';

export default function QuestionCard({ question, selectedOption, chooseOption }) {
  if (!question) return null;
  const labels = ["A", "B", "C", "D"];
  const prompt = question.prompt ?? question.question_text ?? question.question ?? "";
  const difficulty = String(question.difficulty ?? "").toLowerCase();

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Question Prompt */}
      <div className="w-full min-w-0 bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-100">
        {(question.topic || difficulty) && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {question.topic && (
              <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                {question.topic}
              </span>
            )}
            {difficulty && (
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                  difficultyStyles[difficulty] || "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {difficulty}
              </span>
            )}
          </div>
        )}
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
          {prompt}
        </h2>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option, index) => (
          <label 
            key={index}
            onClick={() => chooseOption(index)}
            className={`group relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
              ${selectedOption === index 
                ? "border-indigo-600 bg-indigo-50 shadow-md transform scale-[1.01]" 
                : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
          >
            <input 
              type="radio" 
              name="jamb-option"
              className="hidden"
              checked={selectedOption === index}
              readOnly
            />
            
            {/* 1. THE KEYBOARD HINT (The "KBD" look) */}
            <div className={`
                hidden md:flex items-center justify-center w-8 h-8 mr-4 rounded-lg border-b-4 text-sm font-black transition-all
                ${selectedOption === index 
                    ? "bg-indigo-600 border-indigo-800 text-white" 
                    : "bg-white border-slate-300 text-slate-500 shadow-sm"}
            `}>
              {labels[index]}
            </div>

            {/* Mobile-friendly Radio Indicator (shown when KBD is hidden or alongside it) */}
            <div className={`md:hidden w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 
              ${selectedOption === index ? "border-indigo-600 bg-indigo-600" : "border-slate-300"}`}>
              {selectedOption === index && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>

            {/* Option Text */}
            <span className={`text-lg font-medium flex-1 ${selectedOption === index ? "text-slate-900" : "text-slate-600"}`}>
              {option}
            </span>

            {/* Subtle checkmark for selected state */}
            {selectedOption === index && (
                <div className="text-indigo-600 animate-in zoom-in duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
          </label>
        ))}
      </div>

      {/* 2. NAVIGATION SHORTCUT HINTS (The "Tip" Footer) */}
      <div className="hidden md:flex items-center justify-center gap-6 pt-4 border-t border-slate-100 mt-8">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <kbd className="bg-slate-100 px-2 py-1 rounded border-b-2 border-slate-300 text-slate-600">N</kbd> Next
        </p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <kbd className="bg-slate-100 px-2 py-1 rounded border-b-2 border-slate-300 text-slate-600">P</kbd> Previous
        </p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <kbd className="bg-slate-100 px-2 py-1 rounded border-b-2 border-slate-300 text-slate-600">F</kbd> Flag
        </p>
      </div>
    </div>
  );
}